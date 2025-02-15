"use client";

import type { ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import type React from "react";
import {
  useRef,
  useEffect,
  useCallback,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { toast } from "sonner";
import { useLocalStorage, useWindowSize } from "usehooks-ts";

import { cn, removeThinkMessages, sanitizeUIMessages, StateMessage } from "@/lib/utils";

import { ArrowUpIcon, AttachIcon, SearchIcon, StopIcon, ThinkIcon } from "./icons";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

import { GiAtom } from "react-icons/gi";

const suggestedActions = [
  {
    title: "What is the advantage",
    label: "of DeepSeek",
    action: "What is the advantage of DeepSeek?",
  },
  {
    title: "How is python useful",
    label: "for AI engineers?",
    action: "How is python useful for AI engineers?",
  },
];

export function MultimodalInput({
  chatId,
  input,
  setInput,
  isLoading,
  stop,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
  addStateMessage,
  useThink,
  setUseThink
}: {
  chatId: number;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  messages: Array<Message>;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  className?: string;
  addStateMessage: (stateMessage: StateMessage) => void;
  useThink: string;
  setUseThink: (think: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    "",
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || "";
      setInput(finalValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {});
    setLocalStorageInput("");

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [handleSubmit, setLocalStorageInput, width]);

  return (
    <div className="relative w-full flex flex-col bg-[#1A1A1A] rounded-2xl box-animated-border gap-2 h-32 ">
      {/* {messages.length === 0 && (
        <div className="grid sm:grid-cols-2 gap-2 w-full">
          {suggestedActions.map((suggestedAction, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.05 * index }}
              key={`suggested-action-${suggestedAction.title}-${index}`}
              className={index > 1 ? "hidden sm:block" : "block"}
            >
              <Button
                variant="ghost"
                onClick={async () => {
                  append({
                    role: "user",
                    content: suggestedAction.action,
                  });
                }}
                className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
              >
                <span className="font-medium">{suggestedAction.title}</span>
                <span className="text-muted-foreground">
                  {suggestedAction.label}
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      )} */}

      <Textarea
        ref={textareaRef}
        placeholder="Type your messages here"
        value={input}
        onChange={handleInput}
        className={cn(
          "relative resize-none p-3 overflow-y-scroll border-0 focus:outline-none focus:ring-0 resize-none border-transparent focus:border-transparent h-fit",
        )}
        rows={3}
        autoFocus
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            if (isLoading) {
              toast.error("Please wait for the model to finish its response!");
            } else {
              addStateMessage({ id: chatId, title: input })
              submitForm();
            }
          }
        }}
      />

      <div className="relative w-full flex gap-2 pb-2 px-3 justify-between">
        <div className="flex gap-2">
          <div className={"text-xs text-primary-foreground h-8 group/message justify-center ring-1 rounded-3xl shrink-0 ring-border flex gap-1 items-center pl-3 pr-4 text-sm hover:cursor-pointer"}>
            <SearchIcon /> Search
          </div>

          <div className={"text-xs text-primary-foreground h-8 group/message justify-center ring-1 rounded-3xl shrink-0 ring-border flex gap-1 items-center pl-3 pr-4 text-sm hover:cursor-pointer " + (useThink === "think" ? " bg-primary" : "")} onClick={(e) => setUseThink((useThink === "think" ? "" : "think"))}>
            {/* <ThinkIcon size={15} /> IGT */}
            <GiAtom className="text-base" /> IGT
          </div>
        </div>

        <div className="flex gap-2">
          <div className="rounded-full justify-center ring-1 shrink-0 ring-border size-8 flex items-center">
            <AttachIcon size={15} />
          </div>

          {isLoading ? (
            <Button
              className="rounded-full p-1.5 h-fit bottom-2 right-2 m-0.5 border dark:border-zinc-600"
              onClick={(event) => {
                event.preventDefault();
                stop();
                setMessages((messages) => sanitizeUIMessages(messages));
              }}
            >
              <StopIcon size={14} />
            </Button>
          ) : (
            <Button
              className="rounded-full p-1.5 h-fit bottom-2 right-2 m-0.5 border dark:border-zinc-600 right"
              onClick={(event) => {
                event.preventDefault();
                addStateMessage({ id: chatId, title: input })
                submitForm();
              }}
              disabled={input.length === 0}
            >
              <ArrowUpIcon size={14} />
            </Button>
          )}
        </div>
      </div>
    </div >
  );
}
