from typing import List
from langchain_core.documents import Document
from app.config.settings import settings
from app.vectorstore.chroma_client import vector_store
from app.vectorstore.hybrid_retriever import get_relevant_documents


def get_retriever_func():
    if settings.USE_HYBRID_SEARCH:
        return get_relevant_documents

    return lambda query: vector_store.similarity_search(query, k=8)


retriever = get_retriever_func()