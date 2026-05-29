from app.llm.groq_client import llm

from app.schemas.response import TripResponse

structured_llm = llm.with_structured_output(
    TripResponse
)


def budget_optimizer_node(state):

    plan = state["draft_plan"]

    budget = state["user_input"].budget

    prompt = f"""
      You are a senior travel budget optimization specialist.

Your task is NOT to create a new itinerary.

Your task is to improve an existing itinerary while preserving as much quality as possible.

==================================================
INPUT
=====

Budget:
{budget}

Current Itinerary:
{plan}

==================================================
PRIMARY OBJECTIVE
=================

Optimize the itinerary so that:

1. Total cost stays within budget.

2. Traveler experience remains high.

3. The itinerary remains realistic.

4. Daily schedules remain practical.

5. Meal recommendations remain attractive.

==================================================
DO NOT REBUILD EVERYTHING
=========================

Preserve:

* Attractions
* Daily structure
* Breakfast
* Lunch
* Dinner
* Hotel recommendation
* Weather advice
* Packing list

Only modify them if absolutely necessary.

==================================================
BUDGET OPTIMIZATION STRATEGY
============================

Apply these optimizations in order:

Step 1

Reduce unnecessary transportation expenses.

Prefer:

Metro

Walking

Auto-rickshaw

before:

Private cab

Rental car

Premium transport

---

Step 2

Optimize restaurant costs.

Replace only when needed.

Example:

Luxury restaurant
→ Mid-range restaurant

Mid-range restaurant
→ Budget restaurant

Preserve cuisine preferences.

---

Step 3

Optimize accommodation.

Luxury hotel
→ Mid-range hotel

Mid-range hotel
→ Budget hotel

Only if required.

---

Step 4

Reduce optional shopping costs.

---

Step 5

Reduce optional paid activities.

Only if absolutely necessary.

==================================================
PROTECTED ITEMS
===============

Do NOT remove:

Breakfast

Lunch

Dinner

Major attractions

Weather advice

Packing list

Transportation advice

==================================================
FOOD RULES
==========

Every day must still contain:

Breakfast

Lunch

Dinner

Each meal must contain:

* restaurant
* dish
* estimated_cost

Never replace meals with generic text.

Bad:

"Street Food"

"Local Restaurant"

Good:

Karim's

Saravana Bhavan

United Coffee House

==================================================
HOTEL RULES
===========

Always return a specific hotel.

Never return:

"Budget Hotel"

"Luxury Hotel"

"Hotel"

Always return an actual hotel name.

==================================================
QUALITY RULES
=============

Keep itinerary enjoyable.

Do not convert the entire trip into the cheapest possible version.

Maintain a balance between:

Budget

Comfort

Experience

==================================================
FINAL VALIDATION
================

Before returning:

✓ Total cost <= budget

✓ All days preserved

✓ Meals preserved

✓ Attractions preserved

✓ Hotel preserved

✓ Transportation preserved

✓ Weather advice preserved

✓ Packing list preserved

Return the optimized structured itinerary only.

    """

    optimized = structured_llm.invoke(
        prompt
    )

    return {
        "optimized_plan":
        optimized.model_dump()
    }