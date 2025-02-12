import json
import ollama
from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam
from fastapi.responses import StreamingResponse
from typing import List
from ..prompt.ollama_prompt import convert_to_ollama_messages
from ..tools.tools import get_current_weather
from ..db.retrieve import DocumentRetriever

available_tools = {
    "get_current_weather": get_current_weather,
}

def stream_text_usingollama(messages: List[ChatCompletionMessageParam], protocol: str = 'data'):
    draft_tool_calls = []
    draft_tool_calls_index = -1
    startanswer = 0

    # PROMPT_TEMPLATE = """answer this question:
    #     Question:{context}
    #     Format requirements:
    #     - A search engine optimized for comprehensive, accurate, and trusted results. If users need to answer questions about current events., say shortly "tavily"""
    # #messages[-1].content = PROMPT_TEMPLATE.format(context=messages[-1].content)

    stream = ollama.chat(
        messages=messages,
        model="deepseek-r1:1.5b",
        stream=True,
    )

    for chunk in stream:
        if chunk.message:
            # if(startanswer == 1):
            yield '0:{text}\n'.format(text=json.dumps(chunk.message.content))
            continue

    #     elif chunk.done_reason == None:
    #         for tool_call in chunk.message.tool_calls:
    #             name = tool_call.function.name
    #             arguments = tool_call.function.arguments
    #             tool_result = available_tools[name](
    #                 **json.loads(arguments))

    #             if tool_result:
    #                 yield 'a:{{"toolName":"{name}","args":{args},"result":{result}}}\n'.format(
    #                     name=name,
    #                     args=arguments,
    #                     result=json.dumps(tool_result))
    #             else:
    #                 yield '0:{text}\n'.format(text=json.dumps(chunk.message.content))
    #     for choice in chunk.choices:
    #         if choice.finish_reason == "stop":
    #             continue

    #         elif choice.finish_reason == "tool_calls":
    #             for tool_call in draft_tool_calls:
    #                 yield '9:{{"toolCallId":"{id}","toolName":"{name}","args":{args}}}\n'.format(
    #                     id=tool_call["id"],
    #                     name=tool_call["name"],
    #                     args=tool_call["arguments"])

    #             for tool_call in draft_tool_calls:
    #                 tool_result = available_tools[tool_call["name"]](
    #                     **json.loads(tool_call["arguments"]))

    #                 yield 'a:{{"toolCallId":"{id}","toolName":"{name}","args":{args},"result":{result}}}\n'.format(
    #                     id=tool_call["id"],
    #                     name=tool_call["name"],
    #                     args=tool_call["arguments"],
    #                     result=json.dumps(tool_result))

    #         elif choice.delta.tool_calls:
    #             for tool_call in choice.delta.tool_calls:
    #                 id = tool_call.id
    #                 name = tool_call.function.name
    #                 arguments = tool_call.function.arguments

    #                 if (id is not None):
    #                     draft_tool_calls_index += 1
    #                     draft_tool_calls.append(
    #                         {"id": id, "name": name, "arguments": ""})

    #                 else:
    #                     draft_tool_calls[draft_tool_calls_index]["arguments"] += arguments

    #         else:
    #             yield '0:{text}\n'.format(text=json.dumps(choice.delta.content))

    #     if chunk.choices == []:
    #         usage = chunk.usage
    #         prompt_tokens = usage.prompt_tokens
    #         completion_tokens = usage.completion_tokens

    #         yield 'e:{{"finishReason":"{reason}","usage":{{"promptTokens":{prompt},"completionTokens":{completion}}},"isContinued":false}}\n'.format(
    #             reason="tool-calls" if len(
    #                 draft_tool_calls) > 0 else "stop",
    #             prompt=prompt_tokens,
    #             completion=completion_tokens
    #         )

def message_to_rag(message):
    context = DocumentRetriever().query_documents(message)    
    prompt = f"Context:\n{context}\n\nUser Query: {message}\n\nResponse:"
    return prompt


async def get_ollama_stream_instance(messages, protocol):
    #print("message: " + str(messages))

    # PROMPT_TEMPLATE = """answer this question:
    #     Question:{context}
    #     Format requirements:
    #     - A search engine optimized for comprehensive, accurate, and trusted results. If users need to answer questions about current events or current weather or current data, generate only "Ask Tavily"""
    # messages[-1].content = PROMPT_TEMPLATE.format(context=messages[-1].content)
    messages[-1].content = message_to_rag(messages[-1].content)
    print("///////////////////////////////////////")
    print(messages[-1].content)
    print("//////////////////////////////////////")
    ollama_messages = convert_to_ollama_messages(messages)
    response = StreamingResponse(stream_text_usingollama(ollama_messages, protocol))
    return response