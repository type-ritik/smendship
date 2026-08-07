import { useState } from "react";
import CreatePost from "../Post/CreatePost";

export default function EditorComponent() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  return (
    <>
      <div className="w-full border border-black h-45 flex flex-col bg-white rounded-xl p-5! relative">
        <div className="toolbar flex w-full h-20 justify-center items-center">
          <div className="profile_ w-1/6">
            <div className="w-14 h-14 overflow-hidden flex justify-center items-center rounded-full border-2 border-gray-400">
              <img
                src="
              https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
            "
                alt=""
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
          <div className="w-full flex justify-center items-center">
            <input
              name="post"
              id="post"
              placeholder="Start a post"
              className="flex flex-1 h-14 pl-5! text-balance! outline-none border-2 rounded-full!"
              onClick={() => setIsEditorOpen(true)}
            />
          </div>
        </div>
        {isEditorOpen && (
          <CreatePost
            setIsEditorOpen={setIsEditorOpen}
            isEditorOpen={isEditorOpen}
          />
        )}
      </div>
    </>
  );
}
