
from typing import List
from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import FastAPI, Query
from .stream.ollama_stream import get_ollama_stream_instance
from .utils.instance import Request
from tavily import TavilyClient

load_dotenv(".env")

app = FastAPI()

tavily_client = TavilyClient(api_key="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")

@app.post("/api/chat")
async def handle_chat_data(request: Request, protocol: str = Query('data')):
    requestBody = request.requestBody
    messages = request.messages
    #context = f"\n\nTavily Answer: {tavily_client.qna_search(messages[-1].content)}"
    #prompt = f"Context:\n{context}\n\nUser Query: {messages[-1].content}\n\nResponse:"
    #messages[-1].content = prompt
    #messages[-1].content = tavily_client.qna_search(messages[-1].content)
    # print("last message", messages[-1].content)
    response = await get_ollama_stream_instance(messages, protocol, requestBody == "think")
    #response.headers['x-vercel-ai-data-stream'] = 'v1'
    return response