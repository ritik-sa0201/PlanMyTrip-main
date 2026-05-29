from fastapi import APIRouter
from fastapi.responses import FileResponse

from app.services.pdf_service import (
    create_trip_pdf
)

from app.graph.builder import graph

from app.schemas.request import TripRequest


router = APIRouter(
    prefix="/trip",
    tags=["Trip"]
)


@router.post("/generate")

def generate_trip_plan(
        request: TripRequest
):

    result = graph.invoke(
        {
            "user_input": request
        }
    )

    return result["final_output"]


@router.post("/pdf")
def generate_pdf(
        request: TripRequest
):

    result = graph.invoke(
        {
            "user_input":
            request
        }
    )

    create_trip_pdf(
        result["final_output"],
        "trip.pdf"
    )

    return FileResponse(
        "trip.pdf",
        media_type="application/pdf",
        filename="trip.pdf"
    )