from langchain_core.prompts import ChatPromptTemplate
import langsmith

from app.llm.groq_client import llm

from app.schemas.response import TripResponse

from app.prompts.planner_prompt import PLANNER_PROMPT


structured_llm = llm.with_structured_output(
    TripResponse
)


@langsmith.traceable(
    name="generate_trip",
    metadata={"ls_provider": "langchain", "ls_project": "PlanMyTrip"}
)
def generate_trip(
        city,
        budget,
        travellers,
        cuisine,
        travel_type,
        additional_info,
        days,
        context
):

    prompt = ChatPromptTemplate.from_template(
        PLANNER_PROMPT
    )

    chain = prompt | structured_llm

    return chain.invoke(
    {
        "city": city,
        "budget": budget,
        "travellers": travellers,
        "cuisine": cuisine,
        "travel_type": travel_type,
        "additional_info": additional_info,
        "days": days,
        "context": context
    }
)