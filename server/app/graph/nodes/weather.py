from app.services.weather_service import get_weather
import langsmith


@langsmith.traceable(
    name="weather_node",
    metadata={"ls_provider": "langchain", "ls_project": "PlanMyTrip"}
)
def weather_node(state):
    city = state["user_input"].city
    weather = get_weather(city)
    context = f"""
                    You are a weather assistant providing travel-relevant weather information.
                    Current Weather
                    - City: {city}
                    - Temperature: {weather['temperature']}°C
                    - Condition: {weather['description']}
                    Generate a concise travel weather summary that includes:
                    1. Overall weather conditions.
                    2. Recommended clothing.
                    3. Items the traveler should carry (umbrella, sunscreen, jacket, sunglasses, water bottle, etc.).
                    4. Outdoor activity suitability.
                    5. Safety precautions, if applicable (heat, rain, wind, cold, storms, poor visibility, etc.).
                    6. Any weather-related factors that could affect transportation or sightseeing.
                    Keep the response factual, practical, and under 150 words.
                    Do not invent weather conditions beyond the provided data.
                    """
    return {
        "weather_context": context
    }