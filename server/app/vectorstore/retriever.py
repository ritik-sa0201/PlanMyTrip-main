from app.vectorstore.chroma_client import vector_store


retriever = vector_store.as_retriever(
    search_kwargs={
        "k": 8
    }
)