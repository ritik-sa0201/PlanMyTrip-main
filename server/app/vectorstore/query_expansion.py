from typing import List
from functools import lru_cache
from langchain_core.prompts import PromptTemplate
from langsmith import traceable
from app.llm.groq_client import llm
from app.config.settings import settings


# Query expansion prompt - retrieval focused
QUERY_EXPANSION_PROMPT = PromptTemplate(
    input_variables=["original_query"],
    template="""
You are an expert search query generator for travel information retrieval.
Given a user's travel planning request, generate {query_count} specific search queries in JSON format that would maximize retrieval recall.

Original request: {original_query}

Generate exactly these query types:
1. Two attraction-focused queries (different aspects of attractions)
2. One restaurant/food query
3. One transportation query

Requirements:
- Return ONLY a JSON array of strings
- Each query must be specific and travel-relevant
- Do NOT include explanations or additional text
- Do NOT answer the user's question directly
- Focus on information retrieval, not trip planning

Example format: ["query1", "query2", "query3", "query4"]

Generated search queries:
"""
)


@traceable(
    name="query_expansion",
    metadata={"ls_provider": "langchain", "ls_model_name": "{{env.MODEL_NAME}}", "ls_project": "PlanMyTrip"}
)
@lru_cache(maxsize=settings.QUERY_EXPANSION_CACHE_SIZE)
def expand_query(original_query: str) -> List[str]:
    """
    Generate multiple search queries from the original user query using LLM.
    Results are cached to avoid repeated LLM calls for identical queries.

    Args:
        original_query: User's original travel request

    Returns:
        List of expanded search queries (exactly QUERY_EXPANSION_COUNT items)
    """
    try:
        if not original_query.strip():
            return [original_query] * settings.QUERY_EXPANSION_COUNT  # Return copies of empty query as fallback


        # Format prompt
        prompt = QUERY_EXPANSION_PROMPT.format(
            original_query=original_query,
            query_count=settings.QUERY_EXPANSION_COUNT
        )

        # Generate response
        response = llm.invoke(prompt)
        generated_text = response.content if hasattr(response, 'content') else str(response)

        # Parse JSON response
        import json
        try:
            queries = json.loads(generated_text.strip())
            # Ensure we have exactly the requested number of queries
            if not isinstance(queries, list) or len(queries) != settings.QUERY_EXPANSION_COUNT:
                raise ValueError(f"Expected list of {settings.QUERY_EXPANSION_COUNT} queries, got {queries}")
            # Ensure all items are strings
            queries = [str(q).strip() for q in queries]
        except (json.JSONDecodeError, ValueError, AttributeError) as e:
            # Generate fallback queries based on the original query
            base_query = original_query.strip()
            queries = [
                f"{base_query} attractions sightseeing",
                f"{base_query} historical sites monuments",
                f"{base_query} restaurants local cuisine",
                f"{base_query} public transportation metro bus"
            ]
            # If we need more than 4, add generic ones
            while len(queries) < settings.QUERY_EXPANSION_COUNT:
                queries.append(f"{base_query} travel information")
            # Trim if we have too many
            queries = queries[:settings.QUERY_EXPANSION_COUNT]

        return queries

    except Exception as e:
        # Fallback to basic query variations
        base_query = original_query.strip() if original_query.strip() else "travel"
        queries = [
            f"{base_query} attractions sightseeing",
            f"{base_query} historical sites monuments",
            f"{base_query} restaurants local cuisine",
            f"{base_query} public transportation metro bus"
        ]
        # Adjust to requested count
        if len(queries) < settings.QUERY_EXPANSION_COUNT:
            while len(queries) < settings.QUERY_EXPANSION_COUNT:
                queries.append(f"{base_query} travel information")
        else:
            queries = queries[:settings.QUERY_EXPANSION_COUNT]
        return queries