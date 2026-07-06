from app.vectorstore.retriever import retriever
from langsmith import traceable


@traceable(
    name="rag_node",
    metadata={"ls_provider": "langchain", "ls_project": "PlanMyTrip"}
)
def rag_node(state):

    user = state["user_input"]

    query = f"""
    {user.city}
    {user.travel_type}
    {user.preferred_cuisine}
    attractions
    restaurants
    hotels
    transport
    """

    docs = retriever.invoke(
        query
    )

    context = "\n\n".join(
        doc.page_content
        for doc in docs
    )

    return {
        "rag_context": context
    }