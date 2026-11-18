import React, { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { useSendTextMessage } from "../../services/ChatRoomService";
import type { Message } from "../../utils/ChatInterface";

interface ChatEditorProp {
  chatRoomId: string | undefined;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function ChatEditor({
  chatRoomId,
  setMessages,
}: ChatEditorProp) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data, error, sendTextMessage } = useSendTextMessage();

  const canSend = text.trim().length > 0;

  const handleSend = async () => {
    if (!canSend) return;
    const content = text.trim();
    setText(""); // clear right away so the UI feels instant
    textareaRef.current?.focus();

    try {
      await sendTextMessage({ variables: { chatRoomId, content } });
    } catch (err) {
      console.error("Error sending message:", err);
      setText(content); // give the text back if sending failed
    }
  };

  useEffect(() => {
    if (error) console.error("Error sending message:", error);

    if (data) {
      const newMessage: Message = {
        id: data.sendMessage.id,
        chatRoomId: data.sendMessage.chatRoomId,
        content: data.sendMessage.content,
        senderId: data.sendMessage.sender.id,
        sender: {
          id: data.sendMessage.sender.id,
          name: data.sendMessage.sender.name,
        },
      };
      setMessages((prev) =>
        prev.some((m) => m.id === newMessage.id) ? prev : [...prev, newMessage],
      );
    }
  }, [data, error, setMessages]);

  // Auto-grow the textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [text]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-teal-100 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-teal-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-100">
        <textarea
          ref={textareaRef}
          name="chat_editor"
          id="chat_editor"
          value={text}
          onKeyDown={handleKeyDown}
          onChange={(e) => setText(e.target.value)}
          rows={1}
          aria-label="Message"
          className="no-scrollbar max-h-36 w-full resize-none bg-transparent py-1 text-base leading-5 text-slate-800 outline-none placeholder:text-slate-400"
          placeholder="Type a message (Ctrl+Enter to send)"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
            canSend
              ? "bg-teal-600 text-white shadow-md hover:bg-teal-700 active:scale-90"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          <FiSend
            className={`transition-transform ${canSend ? "translate-x-px -translate-y-px" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
