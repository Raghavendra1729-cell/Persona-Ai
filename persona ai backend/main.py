import os
from typing import List, Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import APIConnectionError, APIStatusError, APITimeoutError, AsyncOpenAI
from pydantic import BaseModel, Field

from prompts import SYSTEM_PROMPTS


load_dotenv()

app = FastAPI(title="Scaler Persona Bot")


def get_allowed_origins() -> List[str]:
    default_origin = "http://localhost:5173"
    raw_origins = os.environ.get("FRONT_END_URL", default_origin)
    origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

    if default_origin not in origins:
        origins.append(default_origin)

    return origins


app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1)


class ChatRequest(BaseModel):
    persona_id: str = Field(min_length=1)
    message: str = Field(min_length=1)
    chat_history: List[Message] = Field(default_factory=list)


@app.post("/api/chat")
async def chat_with_persona(request: ChatRequest):
    api_key = os.environ.get("HF_TOKEN") or os.environ.get("OPENAI_API_KEY")
    model_name = os.environ.get("HF_MODEL")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="API key is not configured on the server.",
        )

    if not model_name:
        raise HTTPException(
            status_code=500,
            detail="HF_MODEL is not configured on the server.",
        )

    system_prompt = SYSTEM_PROMPTS.get(request.persona_id)
    if not system_prompt:
        raise HTTPException(status_code=400, detail="Invalid persona selected.")

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(
        {"role": msg.role, "content": msg.content} for msg in request.chat_history
    )
    messages.append({"role": "user", "content": request.message})

    client = AsyncOpenAI(
        base_url="https://router.huggingface.co/v1",
        api_key=api_key,
        timeout=float(os.environ.get("HF_TIMEOUT_SECONDS", "30")),
    )

    try:
        completion = await client.chat.completions.create(
            model=model_name,
            messages=messages,  # type: ignore[arg-type]
            max_tokens=300,
        )

        reply = completion.choices[0].message.content
        if not reply:
            raise HTTPException(
                status_code=502,
                detail="The AI provider returned an empty response.",
            )

        return {"reply": reply}
    except APITimeoutError as exc:
        raise HTTPException(
            status_code=504,
            detail="The AI provider took too long to respond. Please try again.",
        ) from exc
    except APIConnectionError as exc:
        raise HTTPException(
            status_code=502,
            detail="The AI provider is temporarily unreachable. Please try again.",
        ) from exc
    except APIStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail="The AI provider returned an error. Please try again.",
        ) from exc
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Unable to process your request right now.",
        ) from exc
