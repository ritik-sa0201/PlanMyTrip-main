from app.llm.groq_client import llm
from app.prompts.generator_prompt import get_generator_prompt
from app.schemas.response import TripResponse
structured_llm = llm.with_structured_output(TripResponse)

def generator_node(state):
    optimized_plan = state["optimized_plan"]
    budget = state["user_input"].budget
    prompt = get_generator_prompt(
        optimized_plan=optimized_plan,
        budget=budget
    )
    validated = structured_llm.invoke(prompt)
    return {
        "final_output": validated.model_dump()
    }