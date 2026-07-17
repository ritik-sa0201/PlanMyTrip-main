from pydantic import BaseModel


class Meal(BaseModel):
    restaurant: str
    dish: str
    estimated_cost: int


class Activity(BaseModel):
    place: str
    description: str
    estimated_cost: int
    transport_mode: str
    duration_hours: float


class DayPlan(BaseModel):
    day: int
    date: str
    day_budget: int
    breakfast: Meal
    lunch: Meal
    dinner: Meal
    activities: list[Activity]


class TripResponse(BaseModel):
    summary: str
    accommodation_suggestion: str
    transportation_advice: str
    weather_advice: str
    packing_list: list[str]
    estimated_total_cost: int
    days: list[DayPlan]