import React, { useEffect } from "react";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
}

interface ChatCanvaProps {
  messagesEndRef: React.RefObject<HTMLDivElement>;
  messages: Message[];
}

function ChatCanva({ messagesEndRef, messages }: ChatCanvaProps) {
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesEndRef, messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4! flex flex-col gap-3 no-scrollbar">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex flex-col max-w-[75%] rounded-2xl px-3.5! py-2! text-sm shadow-sm relative group transition-all ${msg.sender === "me" ? "bg-emerald-600 text-white rounded-tr-none self-end" : "bg-white text-gray-800 rounded-tl-none self-start border border-gray-100"}`}
        >
          <p className="whitespace-pre-wrap wrap-break-words leading-relaxed pr-8!">
            {msg.text}
          </p>
          <span
            className={`text-[10px] absolute bottom-1 right-2 select-none ${msg.sender == "me" ? "text-emerald-100" : "text-gray-400"}`}
          >
            {msg.time}
          </span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatCanva;
