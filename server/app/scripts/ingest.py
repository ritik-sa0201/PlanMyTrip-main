import uuid
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

from app.loaders.web_loader import load_websites
from app.vectorstore.chroma_client import vector_store


# PDF
pdf_loader = PyPDFLoader(
    "data/delhi/delhi.pdf"
)

pdf_docs = pdf_loader.load()


# URLs
with open(
    "data/urls.txt",
    "r",
    encoding="utf-8"
) as f:

    urls = [
        line.strip()
        for line in f
        if line.strip()
    ]


# Website Documents
website_docs = load_websites(
    urls
)


# Merge PDF + Website Data
documents = pdf_docs + website_docs


# Chunking
splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=150
)

chunks = splitter.split_documents(
    documents
)


# Add unique IDs to each chunk for reliable retrieval
for i, chunk in enumerate(chunks):
    chunk.metadata["id"] = str(uuid.uuid4())


# Metadata
for chunk in chunks:
    chunk.metadata["city"] = "Delhi"


# Store in ChromaDB with explicit IDs
ids = [chunk.metadata["id"] for chunk in chunks]
vector_store.add_documents(
    documents=chunks,
    ids=ids
)