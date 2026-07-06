from langgraph.graph import StateGraph, START

from app.graph.state import TripState

from app.graph.nodes.rag import rag_node
from app.graph.nodes.weather import weather_node
from app.graph.nodes.search import search_node
from app.graph.nodes.planner import planner_node
from app.graph.nodes.budget_optimizer import budget_optimizer_node
from app.graph.nodes.generator import generator_node



def safe_rag_node(state):
    try:
        return rag_node(state)
    except Exception as e:
        return {"rag_context": ""}


def safe_weather_node(state):
    try:
        return weather_node(state)
    except Exception as e:
        return {"weather_context": ""}


def safe_search_node(state):
    try:
        return search_node(state)
    except Exception as e:
        return {"search_context": ""}


workflow = StateGraph(TripState)

# Nodes with error handling
workflow.add_node("rag", safe_rag_node)
workflow.add_node("weather", safe_weather_node)
workflow.add_node("search", safe_search_node)
workflow.add_node("planner", planner_node)
workflow.add_node("budget_optimizer", budget_optimizer_node)
workflow.add_node("generator", generator_node)

# Edges: fan-in from START to the three parallel nodes
workflow.add_edge(START, "rag")
workflow.add_edge(START, "weather")
workflow.add_edge(START, "search")

# Edges: each of the three nodes feeds into planner (planner waits for all)
workflow.add_edge("rag", "planner")
workflow.add_edge("weather", "planner")
workflow.add_edge("search", "planner")

# Remaining linear edges
workflow.add_edge("planner", "budget_optimizer")
workflow.add_edge("budget_optimizer", "generator")

# Set finish point
workflow.set_finish_point("generator")

graph = workflow.compile()