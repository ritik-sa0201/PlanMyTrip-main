from langchain_community.document_loaders import WebBaseLoader


def load_websites(urls):

    all_docs = []

    for url in urls:

        try:

            loader = WebBaseLoader(url)

            docs = loader.load()

            all_docs.extend(docs)

            print(f"Loaded: {url}")

        except Exception as e:

            print(f"Failed: {url}")

            print(e)

    return all_docs