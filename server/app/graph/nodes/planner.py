from app.services.planner_service import generate_trip


def planner_node(state):

    user = state["user_input"]

    trip_days = (
        user.end_date -
        user.start_date
    ).days + 1

    result = generate_trip(
        city=user.city,
        budget=user.budget,
        travellers=user.travellers,
        cuisine=user.preferred_cuisine,
        travel_type=user.travel_type,
        additional_info=user.additional_info,
        days=trip_days,
        context=
        state["rag_context"]
        + "\n"
        + state["weather_context"]
        + "\n"
        + state["search_context"]
    )
    print(state["weather_context"])
    print(state["search_context"])
    trip = result.model_dump()

    trip["budget_remaining"] = (
        user.budget -
        trip["estimated_total_cost"]
    )

    return {
        "draft_plan": trip
    }