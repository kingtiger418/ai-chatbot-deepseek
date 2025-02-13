"use client";

import type { Message } from "ai";
import { motion } from "framer-motion";

import { OmaxIcon } from "./icons";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import { cn } from "@/lib/utils";
import { Weather } from "./weather";
import { useEffect, useState } from "react";

export const PreviewMessage = ({
  message,
}: {
  chatId: string;
  message: Message;
  isLoading: boolean;
}) => {
  const [think, setThink] = useState("");
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const messageContent = message.content as string;
    if (message.role === "assistant") {
      var startIndex = messageContent.indexOf("<think>");
      if (startIndex != -1) startIndex = startIndex + 7;
      if (messageContent.indexOf("</think>") == -1) {
        setThink(messageContent.substring(startIndex));
        setContent("");
      } else {
        setThink(messageContent.substring(startIndex, messageContent.indexOf("</think>")));
        setContent(messageContent.substring(messageContent.indexOf("</think>") + 8))
      }
    } else {
      setThink("");
      setContent(messageContent);
    }
  }, [message]);

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-5 group/message"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      data-role={message.role}
    >
      <div
        className={cn(
          "group-data-[role=user]/message:bg-primary group-data-[role=user]/message:text-primary-foreground group-data-[role=user]/message:px-5 group-data-[role=user]/message:pb-2 group-data-[role=user]/message:pt-1 group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl flex flex-col gap-1 w-full rounded-3xl",
        )}
      >
        {message.role === "assistant" && (
          <div className="size-8 flex items-center rounded-full justify-center shrink-0">
            <OmaxIcon size={22} />
          </div>
        )}

        <div className="flex flex-col gap-2 w-full mt-2">
          {
            think && (
              <div className="text-sm border-l-2 border-[#444444] pl-2 text-gray-400 text-justify">
                {think}
              </div>
            )
          }
          {content && (
            <div className="flex flex-col gap-4 text-justify">
              <Markdown>{content}</Markdown>
            </div>
          )}

          {message.toolInvocations && message.toolInvocations.length > 0 && (
            <div className="flex flex-col gap-4">
              {message.toolInvocations.map((toolInvocation) => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === "result") {
                  const { result } = toolInvocation;

                  return (
                    <div key={toolCallId}>
                      {toolName === "get_current_weather" ? (
                        <Weather weatherAtLocation={result} />
                      ) : (
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                      )}
                    </div>
                  );
                }
                return (
                  <div
                    key={toolCallId}
                    className={cn({
                      skeleton: ["get_current_weather"].includes(toolName),
                    })}
                  >
                    {toolName === "get_current_weather" ? <Weather /> : null}
                  </div>
                );
              })}
            </div>
          )}

          {message.experimental_attachments && (
            <div className="flex flex-row gap-2">
              {message.experimental_attachments.map((attachment) => (
                <PreviewAttachment
                  key={attachment.url}
                  attachment={attachment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cn(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          },
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center shrink-0">
          <OmaxIcon size={22} />
        </div>

        <div className="flex flex-col gap-2 w-full mt-4">
          <div className="flex gap-1 text-muted-foreground">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-gray-500 rounded-full"
                animate={{
                  y: [0, -3, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
