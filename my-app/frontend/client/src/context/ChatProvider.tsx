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
    const msgData = data?.onEvent;
    if (msgData?.action === "MESSAGE_RECEIVED") {
      const newMessage: Message = {
        id: msgData.data.msgId,
        content: msgData.data.content,
        sender: {
          id: msgData.data.sender.id,
          name: msgData.data.sender.name,
        },
        senderId: msgData.data.sender.id,
        chatRoomId: msgData.data.chatRoomId,
      };

      if (roomId && newMessage.chatRoomId === roomId) {
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
