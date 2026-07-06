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
    Temperature: {weather['temperature']}°C

    Conditions: {weather['description']}

    Suggest appropriate clothing and precautions.
    """

    return {
        "weather_context": context
    }