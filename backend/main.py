import os
from typing import TypedDict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tavily import TavilyClient
from langgraph.graph import StateGraph, END

# --- CONFIGURATION ---
# You only need your Tavily Key now. No OpenAI key required!
TAVILY_API_KEY = "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" 
tavily = TavilyClient(api_key=TAVILY_API_KEY)

app = FastAPI()

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. DEFINE STATE ---
class AgentState(TypedDict):
    destination: str
    plan: dict
    summary: str

# --- 2. DEFINE AGENT NODES (FREE VERSION) ---

def search_flights(state: AgentState):
    print(f"--- AGENT: Searching flights for {state['destination']} ---")
    try:
        res = tavily.search(query=f"current flight options to {state['destination']}", search_depth="basic")
        return {"plan": {"flights": res['results'][:3]}}
    except:
        return {"plan": {"flights": []}}

def search_hotels(state: AgentState):
    print(f"--- AGENT: Searching hotels in {state['destination']} ---")
    try:
        res = tavily.search(query=f"top luxury hotels in {state['destination']}", search_depth="basic")
        updated_plan = state['plan']
        updated_plan["hotels"] = res['results'][:3]
        return {"plan": updated_plan}
    except:
        return {"plan": state['plan']}

def search_restaurants(state: AgentState):
    print(f"--- AGENT: Searching dining in {state['destination']} ---")
    try:
        res = tavily.search(query=f"best restaurants and cafes in {state['destination']}", search_depth="basic")
        updated_plan = state['plan']
        updated_plan["restaurants"] = res['results'][:3]
        return {"plan": updated_plan}
    except:
        return {"plan": state['plan']}

# --- THE SMART FORMATTER (Zero Cost Summary) ---
def summarize_itinerary(state: AgentState):
    print(f"--- AGENT: Formatting final plan ---")
    p = state['plan']
    dest = state['destination'].title()
    
    # Building a professional Markdown-style summary manually
    summary = f"✨ **AURELIUS CURATED ITINERARY: {dest}** ✨\n"
    summary += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
    summary += f"Greetings. I have successfully coordinated with our global agents to design your escape to {dest}. Here is your bespoke plan:\n\n"

    # 1. Flights Section
    summary += "✈️ **AIR TRAVEL & LOGISTICS**\n"
    if p.get("flights"):
        for f in p["flights"]:
            summary += f"• {f['title']}\n"
    else:
        summary += "• Standard commercial and private charter options available upon request.\n"
    
    # 2. Hotels Section
    summary += "\n🏨 **LUXURY ACCOMMODATIONS**\n"
    if p.get("hotels"):
        for h in p["hotels"]:
            summary += f"• **{h['title']}**: Recommended for its exceptional service.\n"
    else:
        summary += f"• Boutique stays in the heart of {dest} are currently being vetted.\n"

    # 3. Dining Section
    summary += "\n🍽️ **CULINARY EXPERIENCES**\n"
    if p.get("restaurants"):
        for r in p["restaurants"]:
            summary += f"• {r['title']}\n"
    else:
        summary += "• Local gastronomic gems and fine dining reservations pending.\n"

    summary += "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
    summary += "*This itinerary is based on real-time intelligence. Shall I proceed with the bookings?*"
    
    return {"summary": summary}

# --- 3. BUILD THE GRAPH ---
workflow = StateGraph(AgentState)

workflow.add_node("flight_agent", search_flights)
workflow.add_node("hotel_agent", search_hotels)
workflow.add_node("food_agent", search_restaurants)
workflow.add_node("summarizer", summarize_itinerary)

workflow.set_entry_point("flight_agent")
workflow.add_edge("flight_agent", "hotel_agent")
workflow.add_edge("hotel_agent", "food_agent")
workflow.add_edge("food_agent", "summarizer")
workflow.add_edge("summarizer", END)

agent_executor = workflow.compile()

# --- 4. API ENDPOINT ---
class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # We use the user's message as the destination
        inputs = {"destination": request.message, "plan": {}, "summary": ""}
        result = agent_executor.invoke(inputs)
        return {"response": result["summary"]}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="The Concierge is currently overcapacity. Please try again.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)