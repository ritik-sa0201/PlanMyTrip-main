from app.llm.groq_client import llm
from app.schemas.response import TripResponse


structured_llm = llm.with_structured_output(
    TripResponse
)

def validator_node(state):

    city = state["user_input"].city

    draft_plan = state["draft_plan"]

    prompt = f"""
    Validate this trip plan.

    City:
    {city}

    Plan:
    {draft_plan}

    Rules:

    1. All attractions must be in {city}
    2. Remove duplicates
    3. Fix unrealistic costs
    4. Fix unrealistic travel routes
    5. Remove hallucinated places

    Return corrected itinerary.
    """

    response = structured_llm.invoke(prompt)

    return {
    "optimized_plan": response.model_dump()
}