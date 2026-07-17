from langchain_community.utilities import GoogleSerperAPIWrapper
from app.config.settings import settings

search = GoogleSerperAPIWrapper(
    serper_api_key=settings.SERPER_API_KEY,
    type="search"
)
def google_search(query: str):
    return search.results(query)