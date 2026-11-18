import { useState } from "react";
import CreatePost from "../Post/CreatePost";

const AVATAR =
  "https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function EditorComponent() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <>
      <div className="flex w-full items-center gap-3 rounded-2xl border border-teal-100 bg-white p-3 shadow-sm sm:p-4">
        <img
          src={AVATAR}
          alt=""
          className="h-11 w-11 shrink-0 rounded-full border-2 border-teal-100 object-cover sm:h-12 sm:w-12"
        />
        {/* A real button, so it's reachable by keyboard */}
        <button
          type="button"
          onClick={() => setIsEditorOpen(true)}
          className="h-11 flex-1 truncate rounded-full border border-slate-200 bg-slate-50 px-5 text-left text-sm text-slate-500 transition hover:border-teal-300 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-teal-600 sm:h-12"
        >
          What&apos;s on your mind?
        </button>
      </div>

      {isEditorOpen && (
        <CreatePost
          setIsEditorOpen={setIsEditorOpen}
          isEditorOpen={isEditorOpen}
        />
      )}
    </>
  );
}
