import React, { useEffect } from "react";
import type { Message } from "../../utils/ChatInterface";
import { useSelector } from "react-redux";
import type { UserObjState } from "../../utils/userInterfaces";
import { useChatroomChatList } from "../../services/ChatRoomService";
import { useParams } from "react-router-dom";

interface ChatCanvaProps {
  messagesEndRef: React.RefObject<HTMLDivElement>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

function ChatCanva({ messagesEndRef, messages, setMessages }: ChatCanvaProps) {
  const { loadChatList, error, data } = useChatroomChatList();
  const { currentUser } = useSelector((state: UserObjState) => state.user);
  const { id: roomId } = useParams();

  useEffect(() => {
    if (!roomId || roomId === "list") {
      setMessages([]);
      return;
    }
    loadChatList({ variables: { chatRoomId: roomId } });
  }, [roomId, loadChatList, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesEndRef, messages]);

  useEffect(() => {
    if (error) console.error("Error loading chat messages:", error);
    if (data?.retriveAllMessagesOfChatSpace) {
      const history: Message[] = data.retriveAllMessagesOfChatSpace.filter(
        (m: Message) => m.chatRoomId === roomId,
      );
      setMessages((prev) => {
        const ids = new Set(history.map((m) => m.id));
        const live = prev.filter(
          (m) => m.chatRoomId === roomId && !ids.has(m.id),
        );
        return [...history, ...live];
      });
    }
  }, [setMessages, error, data, roomId]);

  return (
    <div className="no-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-4 sm:px-5">
      {messages.length === 0 && (
        <p className="m-auto text-center text-sm text-slate-500">
          No messages yet. Say hello!
        </p>
      )}

      {messages.map((msg) => {
        const mine = msg.sender.id === currentUser?.user.id;
        return (
          <div
            key={msg.id}
            className={`anim-pop flex max-w-[85%] flex-col sm:max-w-[70%] ${
              mine ? "items-end self-end" : "items-start self-start"
            }`}
          >
            <span className="mb-0.5 ml-1 text-[11px] text-slate-500">
              By {!mine ? msg.sender.name.toLocaleLowerCase() : "you"}
            </span>

            <p
              className={`whitespace-pre-wrap wrap-break-word rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm ${
                mine
                  ? "rounded-br-md bg-teal-600 text-white"
                  : "rounded-bl-md border border-teal-100 bg-white text-slate-800"
              }`}
            >
              {msg.content}
            </p>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatCanva;
