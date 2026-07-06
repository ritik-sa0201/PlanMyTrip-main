from typing import List, Dict, Any, Optional
from rank_bm25 import BM25Okapi
from langchain_core.documents import Document


class BM25Retriever:
    """
    BM25 retriever for keyword-based search.
    Builds and searches a BM25 index from document collections.
    """
    
    def __init__(self):
        self.bm25 = None
        self.documents: List[str] = []
        self.metadatas: List[Dict[Any, Any]] = []
        self.ids: List[str] = []

    def build(self, documents: List[str], metadatas: List[Dict[Any, Any]], ids: Optional[List[str]] = None) -> None:
        """
        Build BM25 index from documents.
        
        Args:
            documents: List of document texts
            metadatas: List of metadata dictionaries
            ids: Optional list of document IDs (if not provided, uses index)
        """
        if not documents:
            raise ValueError("Cannot build BM25 index with empty documents")
            
        self.documents = documents
        self.metadatas = metadatas
        self.ids = ids if ids is not None else [str(i) for i in range(len(documents))]
        
        # Tokenize documents for BM25
        tokenized_docs = [doc.lower().split() for doc in documents]
        self.bm25 = BM25Okapi(tokenized_docs)
        

    def search(self, query: str, k: int = 10) -> List[Dict[str, Any]]:
        """
        Search for top-k documents using BM25.
        
        Args:
            query: Search query string
            k: Number of documents to return
            
        Returns:
            List of dictionaries containing page_content, metadata, and score
        """
        if self.bm25 is None:
            raise RuntimeError("BM25 index not built. Call build() first.")
            
        if not query.strip():
            return []
            
        # Tokenize query
        tokenized_query = query.lower().split()
        
        # Get scores
        scores = self.bm25.get_scores(tokenized_query)
        
        # Get top-k indices
        top_k_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:k]
        
        # Prepare results
        results = []
        for idx in top_k_indices:
            results.append({
                "page_content": self.documents[idx],
                "metadata": self.metadatas[idx],
                "score": float(scores[idx]),
                "id": self.ids[idx]
            })
            
        return results
