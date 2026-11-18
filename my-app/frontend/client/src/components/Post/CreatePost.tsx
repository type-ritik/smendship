import { useEffect, useState } from "react";
import { useCreatePost } from "../../services/PostService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { SubmitButton } from "../Auth/AuthUI";

interface CreatePostInterface {
  isEditorOpen: boolean;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreatePost({ isEditorOpen, setIsEditorOpen }: CreatePostInterface) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createPost, loading } = useCreatePost();
  const navigate = useNavigate();

  const canPost = title.trim().length > 0 && content.trim().length > 0;
  const close = () => setIsEditorOpen(false);

  useEffect(() => {
    if (!isEditorOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditorOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canPost) return;

    try {
      const { data } = await createPost({
        variables: {
          input: {
            title: title.trim(),
            content: content.trim(),
            category: "GAMES",
          },
        },
      });

      toast.success(data?.createpost?.message ?? "Post published");
      close();
      navigate("/");
    } catch (err) {
      toast.error((err as Error).message || "Couldn't publish your post.");
    }
  };

  if (!isEditorOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 top-90 flex items-end justify-center p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={close}
      role="presentation"
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-post-title"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="anim-pop flex max-h-[90dvh] w-full max-w-xl flex-col gap-4 rounded-t-2xl border border-teal-100 bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6"
      >
        <div className="flex items-center justify-between">
          <h2 id="create-post-title" className="text-lg font-semibold">
            Create post
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:rotate-90 hover:bg-slate-100"
          >
            <IoClose size={20} />
          </button>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          aria-label="Post title"
          autoFocus
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
        />
        <textarea
          id="post"
          name="post"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          aria-label="Post content"
          className="min-h-40 w-full flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
        />

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            disabled
            title="Image uploads aren't available yet"
            className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-400"
          >
            Add image
          </button>
          <div className="w-32">
            <SubmitButton type="submit" loading={loading} disabled={!canPost}>
              {loading ? "Posting…" : "Post"}
            </SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
