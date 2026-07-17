import hashlib

import cohere
from langchain_community.retrievers import BM25Retriever
from langchain_core.documents import Document
from langsmith import traceable

from app.config.settings import settings
from app.vectorstore.chroma_client import vector_store
from app.vectorstore.query_expansion import expand_query


# ------------------------
# Build BM25
# ------------------------

all_data = vector_store.get()

documents = [
    Document(
        page_content=text,
        metadata=metadata
    )
    for text, metadata in zip(
        all_data["documents"],
        all_data["metadatas"]
    )
]

bm25 = BM25Retriever.from_documents(documents)
bm25.k = settings.TOP_K_BM25

co = cohere.Client(settings.COHERE_API_KEY)


# ------------------------
# Search
# ------------------------

@traceable(name="vector_search")
def vector_search(query):
    return vector_store.similarity_search_with_score(
        query,
        k=settings.TOP_K_VECTOR
    )


@traceable(name="bm25_search")
def bm25_search(query):
    return bm25.invoke(query)


# ------------------------
# RRF
# ------------------------

@traceable(name="fuse_results")
def fuse_results(
    all_vector_results,
    all_bm25_results
):

    scores = {}

    for vector_results, bm25_results in zip(
        all_vector_results,
        all_bm25_results
    ):

        for rank, (doc, _) in enumerate(
            vector_results,
            start=1
        ):

            doc_id = doc.metadata["id"]

            if doc_id not in scores:

                scores[doc_id] = {
                    "document": doc,
                    "score": 0
                }

            scores[doc_id]["score"] += (
                1 /
                (settings.RRF_K + rank)
            )

        for rank, doc in enumerate(
            bm25_results,
            start=1
        ):

            doc_id = doc.metadata["id"]

            if doc_id not in scores:

                scores[doc_id] = {
                    "document": doc,
                    "score": 0
                }

            scores[doc_id]["score"] += (
                1 /
                (settings.RRF_K + rank)
            )

    results = list(scores.values())

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return results


# ------------------------
# Deduplicate
# ------------------------

def deduplicate(results):

    unique = {}

    for result in results:

        content = " ".join(
            result["document"].page_content
            .lower()
            .split()
        )

        key = hashlib.sha256(
            content.encode()
        ).hexdigest()

        if (
            key not in unique
            or
            result["score"] > unique[key]["score"]
        ):
            unique[key] = result

    return list(unique.values())


# ------------------------
# Cohere Rerank
# ------------------------

@traceable(name="rerank_documents")
def rerank_documents(
    query,
    results
):

    response = co.rerank(
        model=settings.COHERE_MODEL,
        query=query,
        documents=[
            r["document"].page_content
            for r in results
        ],
        top_n=8
    )

    return [
        results[item.index]["document"]
        for item in response.results
    ]


# ------------------------
# Main Retriever
# ------------------------

@traceable(name="get_relevant_documents")
def get_relevant_documents(query):

    queries = [query] + expand_query(query)

    vector_results = []
    bm25_results = []

    for q in queries:

        vector_results.append(
            vector_search(q)
        )

        bm25_results.append(
            bm25_search(q)
        )

    fused = fuse_results(
        vector_results,
        bm25_results
    )

    unique = deduplicate(fused)

    return rerank_documents(
        query,
        unique
    )