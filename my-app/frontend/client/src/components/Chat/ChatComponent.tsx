import ChatEditor from "./ChatEditor";
import ChatCanva from "./ChatCanva";
import ChatHeader from "./ChatHeader";
import { useRef, useState } from "react";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey there! How is the project going?",
      sender: "them",
      time: "4:00 PM",
    },
    {
      id: "2",
      text: "Going great! Just implementing the auto-growing input bar right now.",
      sender: "me",
      time: "4:01 PM",
    },
    {
      id: "3",
      text: "Awesome, make sure it grows upwards like WhatsApp!",
      sender: "them",
      time: "4:01 PM",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null!);
  return (
    <>
      <div className="flex flex-col h-full gap-2 max-w-2xl mx-auto border border-gray-200 w-full rounded-2xl shadow-lg bg-[#efeae2] overflow-hidden">
        <ChatHeader />
        <ChatCanva messagesEndRef={messagesEndRef} messages={messages} />
        <ChatEditor chatRoomId={"18323"} setMessages={setMessages} />
      </div>
    </>
  );
}
