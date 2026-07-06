from app.config.settings import settings
from app.vectorstore.hybrid_retriever import hybrid_retriever
from app.vectorstore.chroma_client import vector_store
from langchain_core.documents import Document
from typing import List, Callable


def get_retriever_func():
    """
    Get the appropriate retriever function based on configuration.

    Returns:
        A callable that takes a query string and returns list of Documents
    """
    if settings.USE_HYBRID_SEARCH:
        return hybrid_retriever.get_relevant_documents
    else:
        def vector_retriever(query: str) -> List[Document]:
            return vector_store.similarity_search(query, k=8)
        return vector_retriever

class _CallableWrapper:
    def __init__(self, func: Callable[[str], List[Document]]):
        self.func = func
    def invoke(self, query: str) -> List[Document]:
        return self.func(query)

# The actual retriever used by the RAG node
_retriever_func = get_retriever_func()
retriever = _CallableWrapper(_retriever_func)
