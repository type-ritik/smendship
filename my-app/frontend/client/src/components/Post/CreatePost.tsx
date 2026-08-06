import { useState } from "react";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md top-20 left-0 z-10 w-full h-full flex justify-center items-center">
      <div className="flex flex-col w-[40%] h-[80%] bg-blue-200 p-5 rounded-md gap-3">
        <div className="w-full flex">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Write the title of the post"
            className="flex-1 outline-none border-none"
          />
        </div>
        <div className="w-full flex h-full">
          <textarea
            name="post"
            id="post"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write what's on your mind."
            className="flex-1 h-full resize-none border border-[#CCCCCC] px-2 py-1 rounded-sm outline-none"
          />
        </div>
        <div className="w-full flex justify-start">
          <span className="cursor-pointer bg-blue-400 px-3 py-1 rounded-sm">
            images
          </span>
        </div>
      </div>
    </div>
  );
}
