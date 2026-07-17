from langchain_community.retrievers import BM25Retriever
from langchain_core.documents import Document

bm25 = None

def build(documents: list[Document]):
    global bm25
    bm25 = BM25Retriever.from_documents(documents)


def search(query: str, k: int = 10) -> list[Document]:
    if bm25 is None:
        raise RuntimeError("BM25 index not built.")

    bm25.k = k

    return bm25.invoke(query)