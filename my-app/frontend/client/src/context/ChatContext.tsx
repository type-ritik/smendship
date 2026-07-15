import { createContext } from "react";
import type { Message } from "../utils/ChatInterface";

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined,
);
