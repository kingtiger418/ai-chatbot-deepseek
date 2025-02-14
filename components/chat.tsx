"use client";

import React, { Suspense, lazy, useEffect, useState } from "react";

import { PreviewMessage, ThinkingMessage } from "@/components/message";
import { MultimodalInput } from "@/components/multimodal-input";
import { Overview } from "@/components/overview";
import { StateMessage, StateMessageList } from "@/lib/utils";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { useChat } from "ai/react";
import { toast } from "sonner";
import Image from "next/image";
import { Menu } from "lucide-react";

export function Chat({ addStateMessage, chatId = 1, title, setIsOpen }: {
  addStateMessage: (stateMessage: StateMessage) => void;
  chatId: number;
  title: string;
  setIsOpen: (open: boolean) => void;
}) {
  const [stateMessages, setStateMessages] = useState<StateMessageList[]>([]);

  const [useThink, setUseThink] = useState("");

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
  } = useChat({
    maxSteps: 4,
    experimental_prepareRequestBody: ({ messages }) => {
      return { messages: [messages.at(messages.length - 1), messages.at(messages.length - 2)], requestBody: useThink };
    },
    onError: (error) => {
      if (error.message.includes("Too many requests")) {
        toast.error(
          "You are sending too many messages. Please try again later.",
        );
      }
    },
  });

  useEffect(() => {
    if (isLoading === false) {
      console.log("isLoading done: " + stateMessages.length + " : " + chatId);
      if (stateMessages.length < chatId) {
        setStateMessages([...stateMessages, { id: chatId, stateMessages: messages }])
      } else {
        let updatedList = stateMessages.map((item, index) => {
          if (item.id == chatId) {
            return { ...item, stateMessages: messages }; //gets everything that was already in item, and updates "done"
          }
          return item; // else return unmodified item 
        });
        setStateMessages(updatedList);
      }
    }
  }, [isLoading]);

  useEffect(() => {
    console.log("you changed your chatid: " + chatId + " : " + stateMessages.length);
    if (stateMessages.length < chatId) {
      setMessages([]);
    } else {
      stateMessages.map((item, index) => {
        if (item.id == chatId) {
          setMessages(item.stateMessages)
        }
      });
    }
  }, [chatId]);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div className="min-h-screen text-white relative flex flex-col min-w-0 h-[calc(100dvh-52px)] overflow-hidden pt-20 px-5 md:px-auto">
      <div
        ref={messagesContainerRef}
        className="flex flex-col px-2  pt-3 mx-auto w-full md:max-w-3xl box-animated-border mb-6 gap-4 overflow-hidden relative h-[calc(100dvh-52px)] "
      >
        <div className="flex flex-col gap-1 w-full">
          <div className="w-full relative text-center">
            {title}
          </div>
          <div className="w-full h-[1px] bg-primary"></div>
        </div>

        <div className="flex flex-col group inset-0 relative flex-1 gap-4 overflow-y-scroll overscroll-contain pb-7">
          {messages.length === 0 && <Overview />}

          {messages.map((message, index) => (
            <PreviewMessage
              key={message.id}
              chatId={chatId}
              message={message}
              isLoading={isLoading && messages.length - 1 === index}
            />
          ))}

          {isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1].role === "user" && <ThinkingMessage />}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>
      </div>

      <form className="m-0 relative flex mx-auto pb-4 md:pb-10 gap-2 w-full md:max-w-3xl">
        <MultimodalInput
          chatId={chatId}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
          messages={messages}
          setMessages={setMessages}
          append={append}
          addStateMessage={addStateMessage}
          useThink={useThink}
          setUseThink={setUseThink}
        />
      </form>
    </div>
  );
}