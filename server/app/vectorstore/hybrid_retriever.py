import concurrent.futures
from typing import List, Dict, Any, Tuple
import hashlib
import cohere
from app.config.settings import settings
from app.vectorstore.bm25_retriever import BM25Retriever
from app.vectorstore.query_expansion import expand_query
from app.vectorstore.chroma_client import vector_store
from langchain_core.documents import Document
from langsmith import traceable


class HybridRetriever:
    """
    Hybrid retriever combining BM25 keyword search and vector similarity search
    with query expansion and reciprocal rank fusion.
    """

    def __init__(self):
        self.bm25_retriever = BM25Retriever()
        self.cohere_client = None
        self._initialize_bm25_index()
        self._initialize_cohere_client()

    def _initialize_bm25_index(self) -> None:
        """Build BM25 index from all documents in ChromaDB."""
        try:

            # Get all documents from vector store
            all_data = vector_store.get()

            if not all_data or not all_data.get('documents'):
                return

            documents = all_data['documents']
            metadatas = all_data['metadatas']
            ids = all_data['ids']

            # Build BM25 index
            self.bm25_retriever.build(documents, metadatas, ids)

        except Exception as e:
            # Continue without BM25 - will fall back to vector-only search
            pass

    def _initialize_cohere_client(self) -> None:
        """Initialize the Cohere client for reranking."""
        if not settings.USE_RERANKER or not settings.COHERE_API_KEY:
            return

        try:
            self.cohere_client = cohere.Client(settings.COHERE_API_KEY)
        except Exception as e:
            self.cohere_client = None

    @traceable(
        name="hybrid_retriever._vector_search",
        metadata={"ls_provider": "langchain", "ls_project": "PlanMyTrip"}
    )
    def _vector_search(self, query: str, k: int) -> List[Tuple[Document, float]]:
        """Perform vector similarity search."""
        try:
            return vector_store.similarity_search_with_score(query, k=k)
        except Exception as e:
            return []

    @traceable(
        name="hybrid_retriever._bm25_search",
        metadata={"ls_provider": "langchain", "ls_project": "PlanMyTrip"}
    )
    def _bm25_search(self, query: str, k: int) -> List[Dict[str, Any]]:
        """Perform BM25 keyword search."""
        try:
            return self.bm25_retriever.search(query, k=k)
        except Exception as e:
            return []

    def _search_parallel(self, query: str) -> Tuple[
        List[Tuple[Document, float]],
        List[Dict[str, Any]]
    ]:
        """Run vector and BM25 searches in parallel for a single query."""
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
            future_vector = executor.submit(self._vector_search, query, settings.TOP_K_VECTOR)
            future_bm25 = executor.submit(self._bm25_search, query, settings.TOP_K_BM25)

            vector_results = future_vector.result()
            bm25_results = future_bm25.result()

        return vector_results, bm25_results

    def _compute_rrf_score(
        self,
        doc_id: str,
        vector_results: List[Tuple[Document, float]],
        bm25_results: List[Dict[str, Any]]
    ) -> float:
        """
        Compute Reciprocal Rank Fusion score for a document.

        Args:
            doc_id: Unique identifier of the document
            vector_results: Results from vector search
            bm25_results: Results from BM25 search

        Returns:
            RRF score for the document
        """
        score = 0.0
        k = settings.RRF_K

        # Check vector results
        for rank, (doc, _) in enumerate(vector_results, start=1):
            # We need to match by document ID - this assumes we stored IDs in metadata
            doc_metadata_id = doc.metadata.get('id')
            if doc_metadata_id == doc_id:
                score += 1.0 / (k + rank)
                break

        # Check BM25 results
        for rank, result in enumerate(bm25_results, start=1):
            if result.get('id') == doc_id:
                score += 1.0 / (k + rank)
                break

        return score

    @traceable(
        name="hybrid_retriever._fuse_results",
        metadata={"ls_provider": "langchain", "ls_project": "PlanMyTrip"}
    )
    def _fuse_results(
        self,
        all_vector_results: List[List[Tuple[Document, float]]],
        all_bm25_results: List[List[Dict[str, Any]]]
    ) -> List[Dict[str, Any]]:
        """
        Fuse vector and BM25 results using Reciprocal Rank Fusion across all queries.

        Args:
            all_vector_results: List of vector results for each expanded query
            all_bm25_results: List of BM25 results for each expanded query

        Returns:
            List of fused results sorted by RRF score (descending)
        """
        # Collect all unique documents with their scores
        doc_scores: Dict[str, Dict[str, Any]] = {}

        # Process each query's results
        for query_idx, (vector_results, bm25_results) in enumerate(
            zip(all_vector_results, all_bm25_results)
        ):
            # Process vector results
            for rank, (doc, _) in enumerate(vector_results, start=1):
                doc_id = doc.metadata.get('id', f"vec_{query_idx}_{rank}")
                if doc_id not in doc_scores:
                    doc_scores[doc_id] = {
                        'document': doc,
                        'score': 0.0,
                        'sources': []
                    }
                doc_scores[doc_id]['score'] += 1.0 / (settings.RRF_K + rank)
                doc_scores[doc_id]['sources'].append(f"vector_q{query_idx}_rank{rank}")

            # Process BM25 results
            for rank, result in enumerate(bm25_results, start=1):
                doc_id = result.get('id', f"bm25_{query_idx}_{rank}")
                if doc_id not in doc_scores:
                    doc_scores[doc_id] = {
                        'document': Document(
                            page_content=result['page_content'],
                            metadata=result['metadata']
                        ),
                        'score': 0.0,
                        'sources': []
                    }
                doc_scores[doc_id]['score'] += 1.0 / (settings.RRF_K + rank)
                doc_scores[doc_id]['sources'].append(f"bm25_q{query_idx}_rank{rank}")

        # Convert to list and sort by score
        fused_results = [
            {
                'document': data['document'],
                'metadata': data['document'].metadata,
                'page_content': data['document'].page_content,
                'rrf_score': data['score'],
                'id': data['document'].metadata.get('id', 'unknown'),
                'sources': data['sources']
            }
            for data in doc_scores.values()
        ]

        # Sort by RRF score descending
        fused_results.sort(key=lambda x: x['rrf_score'], reverse=True)

        # Take top K_FINAL
        top_fused = fused_results[:settings.TOP_K_FINAL]

        return top_fused

    def _deduplicate_by_content(self, documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Deduplicate documents by content hash (SHA256 of normalized text).
        Keeps the document with the highest RRF score for each unique content.

        Args:
            documents: List of document dictionaries from RRF

        Returns:
            List of deduplicated documents
        """
        if not documents:
            return []

        # Dictionary to store best document for each content hash
        content_map: Dict[str, Dict[str, Any]] = {}

        for doc in documents:
            # Normalize content: lowercase and remove extra whitespace
            normalized_content = ' '.join(doc['page_content'].lower().split())
            # Generate SHA256 hash
            content_hash = hashlib.sha256(normalized_content.encode('utf-8')).hexdigest()

            # If we haven't seen this content or current document has higher score, update
            if content_hash not in content_map or doc['rrf_score'] > content_map[content_hash]['rrf_score']:
                content_map[content_hash] = doc

        # Convert back to list and sort by RRF score descending
        deduplicated = list(content_map.values())
        deduplicated.sort(key=lambda x: x['rrf_score'], reverse=True)

        return deduplicated

    @traceable(
        name="hybrid_retriever._rerank_documents",
        metadata={"ls_provider": "langchain", "ls_project": "PlanMyTrip"}
    )
    def _rerank_documents(
        self,
        query: str,
        documents: List[Dict[str, Any]]
    ) -> List[Document]:
        """
        Rerank documents using Cohere Rerank API.

        Args:
            query: Original user query
            documents: List of document dictionaries from RRF (after deduplication and filtering)

        Returns:
            List of reranked langchain Documents
        """
        if not settings.USE_RERANKER or self.cohere_client is None:
            return [
                Document(
                    page_content=doc['page_content'],
                    metadata=doc['metadata']
                )
                for doc in documents
            ]

        try:

            # Prepare documents for Cohere API
            documents_text = [doc['page_content'] for doc in documents]

            # Call Cohere Rerank API
            response = self.cohere_client.rerank(
                model=settings.COHERE_MODEL,
                query=query,
                documents=documents_text,
                top_n=min(len(documents_text), 8)  # We want up to 8 results
            )

            # Extract results and map back to original documents
            reranked_results = []
            for result in response.results:
                # Get the original document using the index from Cohere
                original_doc = documents[result.index]
                # Add the relevance score from Cohere
                original_doc['rerank_score'] = result.relevance_score
                reranked_results.append(original_doc)

            # Sort by Cohere relevance score descending
            reranked_results.sort(key=lambda x: x['rerank_score'], reverse=True)

            # Take top 8 (as expected by the planner)
            top_documents = reranked_results[:8]

            # Convert to langchain Documents
            return [
                Document(
                    page_content=doc['page_content'],
                    metadata=doc['metadata']
                )
                for doc in top_documents
            ]

        except Exception as e:
            # Fallback to returning top 8 from the input documents (already sorted by RRF)
            return [
                Document(
                    page_content=doc['page_content'],
                    metadata=doc['metadata']
                )
                for doc in documents[:8]
            ]

    @traceable(
        name="hybrid_retriever.get_relevant_documents",
        metadata={"ls_provider": "langchain", "ls_project": "PlanMyTrip"}
    )
    def get_relevant_documents(self, query: str) -> List[Document]:
        """
        Main retrieval method that implements the full hybrid pipeline.

        Args:
            query: User's original travel query

        Returns:
            List of relevant langchain Documents (exactly 8, to match existing retriever)
        """
        if not settings.USE_HYBRID_SEARCH or self.bm25_retriever.bm25 is None:
            # Fallback to original vector store retriever
            docs = vector_store.similarity_search(query, k=8)
            return docs

        try:

            # Step 1: Query Expansion (returns QUERY_EXPANSION_COUNT queries)
            expanded_queries = expand_query(query)
            all_queries = [query] + expanded_queries  # Include original query

            # Step 2: Parallel Vector and BM25 Search for each query
            all_vector_results = []
            all_bm25_results = []

            # Process queries in batches to avoid overwhelming the system
            batch_size = 4
            for i in range(0, len(all_queries), batch_size):
                batch = all_queries[i:i+batch_size]

                with concurrent.futures.ThreadPoolExecutor(max_workers=batch_size) as executor:
                    future_vector = [
                        executor.submit(self._vector_search, q, settings.TOP_K_VECTOR)
                        for q in batch
                    ]
                    future_bm25 = [
                        executor.submit(self._bm25_search, q, settings.TOP_K_BM25)
                        for q in batch
                    ]

                    for fv, fb in zip(future_vector, future_bm25):
                        all_vector_results.append(fv.result())
                        all_bm25_results.append(fb.result())


            # Step 3: Reciprocal Rank Fusion
            fused_results = self._fuse_results(all_vector_results, all_bm25_results)

            # Step 4: Deduplicate by content (keeping highest RRF score)
            deduplicated_results = self._deduplicate_by_content(fused_results)

            # Step 5: Filter low RRF scores
            filtered_results = [
                doc for doc in deduplicated_results
                if doc['rrf_score'] >= settings.MIN_RRF_SCORE
            ]

            # If we have fewer than 1 document after filtering, use the top 1 from deduplicated results
            # to ensure we always have something to rerank
            if not filtered_results and deduplicated_results:
                filtered_results = [deduplicated_results[0]]

            # Step 6: Cohere Reranking
            final_documents = self._rerank_documents(query, filtered_results)

            return final_documents

        except Exception as e:
            # Fallback to original vector search
            return vector_store.similarity_search(query, k=8)

    # LangChain compatible interface
    def invoke(self, query: str) -> List[Document]:
        return self.get_relevant_documents(query)

# Global instance for reuse
hybrid_retriever = HybridRetriever()