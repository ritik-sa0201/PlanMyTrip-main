from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

from app.loaders.web_loader import load_websites
from app.vectorstore.chroma_client import vector_store


# PDF
pdf_loader = PyPDFLoader(
    "data/delhi/Delhi.pdf"
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

print(
    f"PDF Docs: {len(pdf_docs)}"
)

print(
    f"Website Docs: {len(website_docs)}"
)

print(
    f"Total Docs: {len(documents)}"
)


# Chunking
splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=150
)

chunks = splitter.split_documents(
    documents
)


# Metadata
for chunk in chunks:

    chunk.metadata["city"] = "Delhi"


# Store in Chroma
vector_store.add_documents(
    chunks
)

print(
    f"Inserted {len(chunks)} chunks"
)