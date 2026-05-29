from fastapi import APIRouter

from app.vectorstore.retriever import retriever

router = APIRouter(
    prefix="/rag",
    tags=["RAG"]
)


@router.get("/search")
def search(query: str):

    docs = retriever.invoke(query)

    return {
        "results": [
            {
                "content": doc.page_content,
                "metadata": doc.metadata
            }
            for doc in docs
        ]
    }