import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";

import { useCreatePost, useUploadImage } from "../../services/PostService";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { SubmitButton } from "../Auth/AuthUI";

interface CreatePostInterface {
  isEditorOpen: boolean;
  setIsEditorOpen: Dispatch<SetStateAction<boolean>>;
}

function CreatePost({ isEditorOpen, setIsEditorOpen }: CreatePostInterface) {
  const navigate = useNavigate();

  // Post state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Image state
  const [imageString, setImageString] = useState("");
  const [url, setUrl] = useState("");
  const [imageId, setImageId] = useState("");
  const [imgUploadLoading, setImgUploadLoading] = useState(false);

  // API hooks
  const { createPost, loading } = useCreatePost();
  const { uploadImage } = useUploadImage();

  const canPost = title.trim().length > 0 && content.trim().length > 0;

  const close = () => {
    setIsEditorOpen(false);
  };

  // Reset form after successful publishing
  const resetForm = () => {
    setTitle("");
    setContent("");
    setImageString("");
    setUrl("");
  };

  // Close editor using Escape key
  useEffect(() => {
    if (!isEditorOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsEditorOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditorOpen, setIsEditorOpen]);

  // Select image
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 7 * 1024 * 1024) {
      toast.error("Image must be smaller than 7 MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImageString(reader.result);
        setUrl("");
      }
    };

    reader.onerror = () => {
      toast.error("Unable to read image.");
    };

    reader.readAsDataURL(file);

    // Allow selecting the same file again
    event.target.value = "";
  };

  // Upload selected image
  const handleUpload = async () => {
    if (!imageString) return null;

    if (url) return url;

    setImgUploadLoading(true);

    try {
      const { data } = await uploadImage({
        variables: {
          image: imageString,
        },
      });

      const uploadedUrl = data?.uploadImage?.url;
      const uploadedImageId = data?.uploadImage?.id;
      if (!uploadedUrl || typeof uploadedUrl !== "string") {
        throw new Error("Image upload failed. No URL returned.");
      }

      setUrl(uploadedUrl);
      setImageId(uploadedImageId);

      toast.success("Image uploaded successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to upload image.";

      toast.error(message);

      return null;
    } finally {
      setImgUploadLoading(false);
    }
  };

  // Publish post
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canPost || loading || imgUploadLoading) return;

    try {
      const { data } = await createPost({
        variables: {
          input: {
            title: title.trim(),
            content: content.trim(),
            category: "GAMES",
            imageId: imageId,
          },
        },
      });

      const result = data?.createPost;

      toast.success(result?.message ?? "Post published successfully.");

      resetForm();
      close();

      navigate("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Couldn't publish your post.";

      toast.error(message);
    }
  };

  useEffect(() => {
    if (!isEditorOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isEditorOpen]);

  return createPortal(
    <div
      className="absolute inset-0 bg-black/30 z-50 flex items-end justify-center p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={close}
      role="presentation"
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-post-title"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="anim-pop flex max-h-[90dvh] w-full max-w-xl flex-col gap-4 overflow-y-auto rounded-t-2xl border border-teal-100 bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6"
      >
        {/* Header */}
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

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          aria-label="Post title"
          autoFocus
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
        />

        {/* Content */}
        <textarea
          id="post"
          name="post"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="What's on your mind?"
          aria-label="Post content"
          className="min-h-40 w-full flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
        />

        {/* Image Preview */}
        {imageString && (
          <div className="relative overflow-hidden rounded-xl border border-slate-200">
            <img
              src={imageString}
              alt="Selected post"
              className="max-h-64 w-full object-contain"
            />

            <button
              type="button"
              onClick={() => {
                setImageString("");
                setUrl("");
              }}
              aria-label="Remove selected image"
              className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
            >
              <IoClose size={18} />
            </button>

            {url && (
              <span className="absolute bottom-2 left-2 rounded-full bg-teal-600 px-3 py-1 text-xs text-white">
                Uploaded
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="post-image"
              className="cursor-pointer rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200"
            >
              Add image
            </label>

            <input
              id="post-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {imageString && !url && (
              <button
                type="button"
                onClick={() => void handleUpload()}
                disabled={imgUploadLoading || loading}
                className="rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 disabled:opacity-50"
              >
                {imgUploadLoading ? "Uploading..." : "Upload"}
              </button>
            )}
          </div>

          <div className="w-32">
            <SubmitButton
              type="submit"
              loading={loading || imgUploadLoading}
              disabled={!canPost || loading || imgUploadLoading}
            >
              {loading ? "Posting..." : "Post"}
            </SubmitButton>
          </div>
        </div>
      </form>
    </div>,
    document.body,
  );
}

export default CreatePost;
