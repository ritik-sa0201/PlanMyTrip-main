from typing import TypedDict
from app.schemas.request import TripRequest
class TripState(TypedDict, total=False):
    user_input: TripRequest
    rag_context: str
    weather_context: str
    search_context: str
    draft_plan: dict
    optimized_plan: dict
    final_output: dict