from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

from app.config.settings import settings


embeddings = HuggingFaceEmbeddings(
    model_name="BAAI/bge-base-en-v1.5"
)


vector_store = Chroma(
    collection_name="tripplanner",
    persist_directory=settings.CHROMA_PATH,
    embedding_function=embeddings
)