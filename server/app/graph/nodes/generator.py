def generator_node(state):
    print(state["optimized_plan"])
    return {
        "final_output": state["optimized_plan"]
    }
