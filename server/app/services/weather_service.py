import requests
from app.config.settings import settings
def get_weather(city: str):
    url = (
        "https://api.openweathermap.org/data/2.5/weather"
        f"?q={city}"
        f"&appid={settings.WEATHER_API_KEY}"
        "&units=metric"
    )
    response = requests.get(url)
    data = response.json()
    if "main" not in data:
        return {
            "temperature": "unknown",
            "description": "weather unavailable"
        }
    return {
        "temperature": data["main"]["temp"],
        "description": data["weather"][0]["description"]
    }