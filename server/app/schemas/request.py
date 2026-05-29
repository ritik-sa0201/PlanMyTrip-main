from datetime import date

from pydantic import BaseModel


class TripRequest(BaseModel):

    city: str

    budget: int

    start_date: date

    end_date: date

    travellers: int

    preferred_cuisine: str

    travel_type: str

    additional_info: str | None = None