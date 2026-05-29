import requests

from app.config.settings import settings


def google_search(query: str):

    url = "https://google.serper.dev/search"

    payload = {
        "q": query
    }

    headers = {
        "X-API-KEY": settings.SERPER_API_KEY,
        "Content-Type": "application/json"
    }

    response = requests.post(
        url,
        json=payload,
        headers=headers
    )

    return response.json()