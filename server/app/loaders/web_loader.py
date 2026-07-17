from langchain_community.document_loaders import WebBaseLoader


def load_websites(urls):
    all_docs = []
    for url in urls:
        try:
            loader = WebBaseLoader(url)
            docs = loader.load()
            all_docs.extend(docs)
        except Exception as e:
            pass
    return all_docs