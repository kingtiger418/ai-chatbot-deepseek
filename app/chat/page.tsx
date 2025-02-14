'use client'

import { Chat } from "@/components/chat";
import { OmaxMarkIcon, PlusIcon } from "@/components/icons";
import { StateMessage } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";


export default function Page() {
  const [chatId, setChatId] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<StateMessage[]>([]);

  const addMessages = (message: StateMessage) => {
    console.log(message.id + " : " + messages.length);
    if (messages.length < message.id) {
      setMessages([...messages, message])
    } else {
      let updatedList = messages.map(item => {
        if (item.id == message.id) {
          return { ...item, title: item.title === "" ? message.title : item.title }; //gets everything that was already in item, and updates "done"
        }
        return item; // else return unmodified item 
      });

      setMessages(updatedList);
    }
  }

  useEffect(() => {
    console.log("you click to add message: " + messages.length);
  }, [messages])

  useEffect(() => {
    console.log(isOpen)
  }, [isOpen])

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="absolute z-10 px-3 py-6 flex justify-between items-center bg-transparent gap-4">

        <button className="relative rounded-lg transition-colors pl-1" onClick={(e) => setIsOpen(true)}>
          <Menu className="w-8 h-8" />
        </button>

        <div className="flex items-center gap-2">
          <OmaxMarkIcon width={170} height={40} />
        </div>
      </div>

      {
        isOpen ? <div className="absolute w-full h-full bg-[#000000] bg-opacity-30 z-10 p-4" onClick={(e) => setIsOpen(false)}>
          <motion.div className="box-animated-border w-64 h-full bg-[#1A1A1A] py-4 px-3 overflow-y-scroll overscroll-contain flex flex-col gap-2"
            shadow-md
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}>
            <button className="flex items-right p-2 hover:bg-white/10 rounded-lg transition-colors text-primary-foreground gap-4"
              onClick={(e) => {
                let len = messages.length;
                if (len > 0) {
                  if (messages[len - 1].title === "") return;
                }
                setChatId(len + 1)
              }
              }>
              <PlusIcon size={20} />
              New Chat
            </button>
            <div className="w-full h-[1px] bg-primary"></div>
            {messages.map((message, index) => (
              <div className={"w-full text-primary-foreground w-full rounded-xl py-2 group/message px-2 " + ((index + 1) == chatId ? "bg-primary " : "")} onClick={(e) => setChatId(index + 1)}>
                {message.title}
              </div>
            ))}
          </motion.div>
        </div> : <div></div>
      }

      <Chat addStateMessage={addMessages} chatId={chatId} title={messages.length < chatId ? "New Chat" : messages[chatId - 1].title} setIsOpen={setIsOpen} />
    </div>
  );
}
