import json
from functools import lru_cache
from typing import List

from langchain_core.prompts import PromptTemplate
from langsmith import traceable

from app.config.settings import settings
from app.llm.groq_client import llm


QUERY_EXPANSION_PROMPT = PromptTemplate(
    input_variables=["original_query"],
    template="""
You are an expert search query generator for travel information retrieval.

Generate {query_count} different search queries for this request.

Original Request:
{original_query}

Return ONLY a JSON array of strings.

Example:
[
    "Delhi tourist attractions",
    "Delhi historical places",
    "Delhi restaurants",
    "Delhi public transport"
]
"""
)


@traceable(
    name="query_expansion",
    metadata={
        "ls_provider": "langchain",
        "ls_project": "PlanMyTrip"
    }
)
@lru_cache(maxsize=settings.QUERY_EXPANSION_CACHE_SIZE)
def expand_query(original_query: str) -> List[str]:

    prompt = QUERY_EXPANSION_PROMPT.format(
        original_query=original_query,
        query_count=settings.QUERY_EXPANSION_COUNT
    )
    response = llm.invoke(prompt)
    queries = json.loads(response.content)
    return queries