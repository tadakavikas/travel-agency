from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

# Initialize the "Fancy" LLM (Get a free API key from Google AI Studio)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key="YOUR_API_KEY")

def travel_agent_ai(user_query: str):
    system_prompt = """
    You are a sophisticated, high-end travel concierge named 'Aurelius'. 
    Use elegant, British-inflected English. 
    Your goal is to provide a comprehensive travel plan including:
    1. Flight suggestions (Exquisite carriers)
    2. Hotel recommendations (Luxury stays)
    3. A curated daily itinerary.
    """
    prompt = ChatPromptTemplate.from_messages([("system", system_prompt), ("user", "{input}")])
    chain = prompt | llm
    return chain.invoke({"input": user_query}).content