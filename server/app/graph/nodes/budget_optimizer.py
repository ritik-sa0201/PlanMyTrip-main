from app.llm.groq_client import llm
from app.schemas.response import TripResponse
from app.prompts.budget_optimizer_prompt import get_budget_optimizer_prompt
structured_llm = llm.with_structured_output(TripResponse)

def budget_optimizer_node(state):
    plan = state["draft_plan"]
    budget = state["user_input"].budget
    prompt = get_budget_optimizer_prompt(
        plan=plan,
        budget=budget
    )
    optimized = structured_llm.invoke(prompt)
    return {
        "optimized_plan": optimized.model_dump()
    }