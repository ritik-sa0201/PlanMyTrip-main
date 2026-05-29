from langgraph.graph import StateGraph

from app.graph.state import TripState

from app.graph.nodes.rag import rag_node
from app.graph.nodes.weather import weather_node
from app.graph.nodes.search import search_node
from app.graph.nodes.planner import planner_node
from app.graph.nodes.generator import generator_node
from app.graph.nodes.budget_optimizer import budget_optimizer_node


workflow = StateGraph(
    TripState
)

workflow.add_node(
    "rag",
    rag_node
)

workflow.add_node(
    "weather",
    weather_node
)

workflow.add_node(
    "search",
    search_node
)

workflow.add_node(
    "planner",
    planner_node
)

workflow.add_node(
    "budget_optimizer",
    budget_optimizer_node
)

workflow.add_node(
    "generator",
    generator_node
)

workflow.set_entry_point(
    "rag"
)

workflow.add_edge(
    "rag",
    "weather"
)

workflow.add_edge(
    "weather",
    "search"
)

workflow.add_edge(
    "search",
    "planner"
)

workflow.add_edge(
    "planner",
    "budget_optimizer"
)

workflow.add_edge(
    "budget_optimizer",
    "generator"
)

workflow.set_finish_point(
    "generator"
)

graph = workflow.compile()