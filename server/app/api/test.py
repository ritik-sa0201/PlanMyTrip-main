from fastapi import APIRouter
from app.llm.groq_client import llm
router = APIRouter()
@router.get("/llm-test")
def llm_test():
    response = llm.invoke(
        "Say Hello"
    )
    return {
        "response": response.content
    }