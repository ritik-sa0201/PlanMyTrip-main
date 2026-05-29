from app.llm.groq_client import llm
from app.schemas.response import TripResponse


structured_llm = llm.with_structured_output(
    TripResponse
)


def optimizer_node(state):

    user = state["user_input"]

    plan = state["draft_plan"]

    prompt = f"""
You are a senior travel optimization specialist.

Your task is NOT to create a new itinerary.

Your task is to improve an existing itinerary while preserving as much quality as possible.

==================================================
USER INFORMATION
==================================================

City:
{user.city}

Budget:
{user.budget}

Travellers:
{user.travellers}

Cuisine Preference:
{user.preferred_cuisine}

Travel Type:
{user.travel_type}

Additional Preferences:
{user.additional_info}

==================================================
CURRENT ITINERARY
==================================================

{plan}

==================================================
PRIMARY OBJECTIVE
==================================================

Optimize the itinerary so that:

1. Total cost stays within budget.

2. Traveler experience remains high.

3. The itinerary remains realistic.

4. Daily schedules remain practical.

5. Meals remain attractive.

6. Travel routes become more efficient.

==================================================
IMPORTANT
==================================================

You are NOT creating a new itinerary.

You are refining an existing itinerary.

Preserve:

- Attractions
- Daily structure
- Hotel recommendation
- Packing list
- Weather advice
- Transportation advice

Only modify things when necessary.

==================================================
BUDGET OPTIMIZATION RULES
==================================================

If total cost exceeds budget:

Step 1

Reduce transportation costs.

Prefer:

- Walking
- Metro
- Auto-rickshaw

Before:

- Cab
- Premium transportation

--------------------------------------------------

Step 2

Reduce restaurant costs.

Luxury restaurant
→ Mid-range restaurant

Mid-range restaurant
→ Budget restaurant

Keep cuisine preference intact.

--------------------------------------------------

Step 3

Reduce hotel cost if required.

Luxury hotel
→ Mid-range hotel

Mid-range hotel
→ Budget hotel

--------------------------------------------------

Step 4

Reduce optional shopping expenses.

--------------------------------------------------

Step 5

Reduce optional paid activities.

Only if absolutely necessary.

==================================================
MEAL PROTECTION RULES
==================================================

Every day MUST contain:

Breakfast

Lunch

Dinner

Each meal MUST contain:

- restaurant
- dish
- estimated_cost

Never remove meals.

Never return:

- Street Food
- Local Restaurant
- North Indian Food

Always provide actual restaurant names.

==================================================
ROUTE OPTIMIZATION RULES
==================================================

Group nearby attractions together.

Examples:

- Chandni Chowk + Jama Masjid
- India Gate + National Museum
- Connaught Place + Janpath
- Hauz Khas + Deer Park
- Qutub Minar + Mehrauli

Avoid unnecessary travel.

Avoid crossing the city multiple times in the same day.

==================================================
TRANSPORT RULES
==================================================

Walking:
Nearby attractions

Metro:
Long-distance travel

Auto-rickshaw:
Short local travel

Cab:
Poor metro connectivity
Late-night travel
Family convenience

Do not use the same transport everywhere.

==================================================
QUALITY RULES
==================================================

Keep the itinerary enjoyable.

Do not aggressively cut costs.

Maintain balance between:

- Budget
- Comfort
- Experience

==================================================
FINAL VALIDATION
==================================================

Before returning verify:

✓ Budget not exceeded

✓ Exact number of days preserved

✓ Hotel exists

✓ Breakfast exists

✓ Lunch exists

✓ Dinner exists

✓ Activities exist

✓ Transportation exists

✓ Weather advice exists

✓ Packing list exists

✓ Cuisine preference respected

✓ Travel type respected

✓ Routes optimized

✓ Costs remain realistic

Return ONLY structured output matching the TripResponse schema.
"""

    result = structured_llm.invoke(
        prompt
    )

    return {
        "optimized_plan": result.model_dump()
    }