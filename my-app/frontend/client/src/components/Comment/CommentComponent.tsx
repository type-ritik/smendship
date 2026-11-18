import { useState } from "react";
import { FiSend } from "react-icons/fi";

const AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

// onSubmit is optional until the comment mutation is wired up.
function CommentComponent({
  onSubmit,
}: {
  onSubmit?: (text: string) => void | Promise<void>;
}) {
  const [text, setText] = useState("");
  const canPost = text.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPost) return;
    await onSubmit?.(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-start gap-3">
      <img
        src={AVATAR}
        alt=""
        className="h-9 w-9 shrink-0 rounded-full object-cover"
      />
      <div className="flex flex-1 items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-teal-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-100">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={1}
          aria-label="Add a comment"
          placeholder="Add a comment"
          className="max-h-32 w-full resize-none bg-transparent py-1 text-sm outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!canPost}
          aria-label="Post comment"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white transition hover:bg-teal-700 active:scale-90 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          <FiSend size={14} />
        </button>
      </div>
    </form>
  );
}

export default CommentComponent;
