import { useEffect, useState, type ReactNode } from "react";
import type { Message } from "../utils/ChatInterface";
import { useParams } from "react-router-dom";
import { useSubscription } from "@apollo/client";
import { ON_USER_EVENT } from "../services/NotificationService";
import type { UserObjState } from "../utils/userInterfaces";
import { useSelector } from "react-redux";
import { ChatContext } from "./ChatContext";

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useSelector((state: UserObjState) => state.user);

  const [messages, setMessages] = useState<Message[]>([]);

  const { id: roomId } = useParams<{ id: string }>();

  useEffect(() => {
    setMessages([]);
  }, [roomId]);

  const { data } = useSubscription(ON_USER_EVENT, { skip: !currentUser });

  useEffect(() => {
    console.log("Subscription:", data);
    if (data?.onUserEvent?.action === "NEW_MESSAGE") {
      const newMessage: Message = {
        id: data.onUserEvent.data.id,
        content: data.onUserEvent.data.content,
        sender: {
          id: data.onUserEvent.data.sender.id,
          name: data.onUserEvent.data.sender.name,
        },
        chatRoom: {
          id: data.onUserEvent.data.chatRoom.id,
        },
      };

      if (roomId && newMessage.chatRoom.id === roomId) {
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      }
    }
  }, [data, roomId]);

  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};
