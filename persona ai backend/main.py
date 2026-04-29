from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
from dotenv import load_dotenv
from openai import AsyncOpenAI 

from prompts import SYSTEM_PROMPTS

load_dotenv()

app = FastAPI(title="Scaler Persona Bot")

front_end_urls = os.getenv("FRONT_END_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[front_end_urls],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)


class Message(BaseModel):
    role: str     
    content: str  

class ChatRequest(BaseModel):
    persona_id: str            
    message: str    
    chat_history: List[Message] 



@app.post("/api/chat")
async def chat_with_persona(request: ChatRequest):
    hf_key = os.environ.get("HF_TOKEN") 
    if not hf_key:
        raise HTTPException(status_code=500, detail="API Key not configured on the server.")

    if request.persona_id not in SYSTEM_PROMPTS:
        raise HTTPException(status_code=400, detail="Invalid persona selected.")

    messages = [
        {"role": "system", "content": SYSTEM_PROMPTS[request.persona_id]}
    ]
    
    for msg in request.chat_history:
        messages.append({"role": msg.role, "content": msg.content})
        
    messages.append({"role": "user", "content": request.message})

    client = AsyncOpenAI(
        base_url="https://router.huggingface.co/v1",
        api_key=hf_key,
    )

    try:
        completion = await client.chat.completions.create(
            model="meta-llama/Meta-Llama-3-8B-Instruct:fastest",
            messages=messages,
            max_tokens=300, 
        )
        
        reply = completion.choices[0].message.content
        
        return {"reply": reply}
        
    except Exception as e:
        print(f"Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error.")