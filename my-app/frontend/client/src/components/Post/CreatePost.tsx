import { useEffect, useState } from "react";
import { useCreatePost } from "../../services/PostService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ImExit } from "react-icons/im";

interface CreatePostInterface {
  isEditorOpen: boolean;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreatePost({ isEditorOpen, setIsEditorOpen }: CreatePostInterface) {
  const [title, setTitle] = useState("");
  // const [images, setImages] = useState("");
  const [content, setContent] = useState("");
  const { createpost, data, error, loading } = useCreatePost();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    await createpost({
      variables: {
        title,
        content,
        category: "GAMES",
      },
    });
  };

  useEffect(() => {
    if (loading) {
      toast.loading("Creating post...", { id: "createPost" });
    }

    if (data) {
      toast.success("Post created successfully!", data.createPost?.message);
      toast.dismissAll();
      navigate("/");
      setIsEditorOpen(false);
    }

    if (error) {
      toast.error(error.message);
    }
  }, [error, data, loading, navigate, setIsEditorOpen]);

  return (
    <>
      {isEditorOpen && (
        <>
          <div
            className={`fixed inset-0 bg-white/30 backdrop-blur-md top-20 left-0 z-10 w-full h-full flex justify-center items-center`}
          >
            <div
              className="absolute top-5 right-0 p-2 cursor-pointer"
              onClick={() => setIsEditorOpen(false)}
            >
              <ImExit />
            </div>
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
              <div className="w-full flex justify-between">
                <span className="cursor-pointer bg-blue-300 text-blue-800 px-3 py-1 rounded-sm hover:text-blue-300 hover:bg-blue-800 transition-all duration-300">
                  images
                </span>
                <span
                  onClick={() => handleSubmit()}
                  className="cursor-pointer bg-green-400 px-4 py-1 rounded-sm text-black text-sm hover:bg-green-800 hover:text-green-300 transition-all duration-300"
                >
                  Post
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default CreatePost;
