from app.services.serper_service import google_search
from datetime import datetime
import langsmith


@langsmith.traceable(
    name="search_node",
    metadata={"ls_provider": "langchain", "ls_project": "PlanMyTrip"}
)
def search_node(state):

    user = state["user_input"]

    month = user.start_date.strftime("%B")

    duration = (
        user.end_date -
        user.start_date
    ).days

    queries = [
        f"best places to visit in {user.city} during {month}",
        f"best {user.preferred_cuisine} restaurants in {user.city}",
        f"best {user.travel_type} experiences in {user.city}",
        f"things to do in {user.city} under ₹{user.budget}",
        f"events festivals exhibitions in {user.city} {month}",
        f"activities for {user.travellers} travellers in {user.city}",
        f"{user.additional_info} activities in {user.city}",
        f"hidden gems in {user.city}",
        f"must try food in {user.city} {month}",
        f"{duration} day itinerary ideas for {user.city}"
    ]

    search_results = []

    for query in queries:

        result = google_search(query)

        if "organic" in result:

            for item in result["organic"][:3]:

                search_results.append(
                    f"""
                    Query:
                    {query}

                    Title:
                    {item.get('title')}

                    Snippet:
                    {item.get('snippet')}
                    """
                )

    return {
        "search_context":
        "\n\n".join(search_results)
    }