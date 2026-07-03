import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
}

interface ChatEditorProp {
  chatRoomId: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function ChatEditor({
  chatRoomId,
  setMessages,
}: ChatEditorProp) {
  console.log(chatRoomId);
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const el = textareaRef.current;
    if (el && el.value.trimStart().length > 0) {
      el.focus();
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newMessage: Message = {
        id: Date.now().toString(),
        text: text.trim(),
        sender: "me",
        time: currentTime,
      };

      setMessages((prev) => [...prev, newMessage]);
      console.log("Sending value: ", el.value);
      setText("");
      textareaRef.current?.focus();
    }
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [text]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = textareaRef.current;

    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      if (el && el.value.trimStart().length > 0) {
        el.focus();
        console.log(el.value);
        handleSend();
        setText("");
      }
    }
  };

  return (
    <div className="bg-white border-t border-gray-100 flex p-3! items-end gap-2.5 shadow[0_-4px_12px_rgba(0,0,0,0.02)]">
      <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all flex items-end px-2! py-1.5!">
        <textarea
          ref={textareaRef}
          name="chat_editor"
          id="chat_editor"
          value={text}
          onKeyDown={handleKeyDown}
          onChange={(e) => setText(e.target.value)}
          rows={1}
          className="w-full bg-transparent px-2! text-base leading-5 text-gray-800 placeholder-gray-400 focus:outline-none resize-none overflow-y-auto max-h-35 no-scrollbar"
          placeholder="Type here..."
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          className={`p-2.5! rounded-xl flex items-center justify-center transition-all ${
            text.trim()
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <svg
            className="w-5 h-5 transform rotate"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
