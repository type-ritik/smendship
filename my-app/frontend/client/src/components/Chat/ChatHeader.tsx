import React from "react";

function ChatHeader() {
  return (
    <div className="flex items-center justify-between px-4! py-3! bg-white border-b border-gray-200 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
          RS
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-sm leading-tight">
            Ritik Sharma
          </h3>
          <span className="text-xs text-emerald-600 font-medium">Online</span>
        </div>
      </div>
      <button className="text-gray-500! hover:text-gray-700! px-2! py-2! rounded-full! hover:bg-gray-100! transition-colors">
        ✕
      </button>
    </div>
  );
}

export default ChatHeader;
