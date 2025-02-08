import json
from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam
from typing import List, Any
from ..utils.instance import ClientMessage

def convert_to_ollama_messages(messages: List[ClientMessage]) -> List[ChatCompletionMessageParam]:
    ollama_messages = []

    for message in messages:
        parts = []
        tool_calls = []

        parts.append({
            'type': 'text',
            'text': message.content
        })

        if (message.experimental_attachments):
            for attachment in message.experimental_attachments:
                if (attachment.contentType.startswith('image')):
                    parts.append({
                        'type': 'image_url',
                        'image_url': {
                            'url': attachment.url
                        }
                    })

                elif (attachment.contentType.startswith('text')):
                    parts.append({
                        'type': 'text',
                        'text': attachment.url
                    })

        if(message.toolInvocations):
            for toolInvocation in message.toolInvocations:
                tool_calls.append({
                    "id": toolInvocation.toolCallId,
                    "type": "function",
                    "function": {
                        "name": toolInvocation.toolName,
                        "arguments": json.dumps(toolInvocation.args)
                    }
                })

        tool_calls_dict = {"tool_calls": tool_calls} if tool_calls else {"tool_calls": None}

        ollama_messages.append({
            "role": message.role,
            "content": message.content,
            # **tool_calls_dict,
        })

        # if(message.toolInvocations):
        #     for toolInvocation in message.toolInvocations:
        #         tool_message = {
        #             "role": "tool",
        #             "tool_call_id": toolInvocation.toolCallId,
        #             "content": json.dumps(toolInvocation.result),
        #         }

        #         ollama_messages.append(tool_message)

    return ollama_messages