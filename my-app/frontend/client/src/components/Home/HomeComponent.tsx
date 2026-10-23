import { useNavigate } from "react-router-dom";
import EditorComponent from "../Editor/EditorComponent";
import { useSelector } from "react-redux";
import type { UserObjState } from "../../utils/userInterfaces";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { FOLLOW_FRIEND } from "../../services/HomeService";
import toast from "react-hot-toast";
import type { postObj } from "../../utils/postInterfaces";
// import CommentComponent from "../Comment/CommentComponent";
import ShowComments from "../Comment/ShowComments";
import { useGetPost } from "../../services/PostService";

function HomeComponent() {
  // States
  const [postData, setPostData] = useState<postObj[]>([]);
  // Navigator
  const navigate = useNavigate();

  const [showComment, setShowComment] = useState<string | null>(null);

  // Selector
  const { currentUser } = useSelector((state: UserObjState) => state.user);

  // Mutations
  const [
    friendSendRequest,
    {
      data: followFriendData,
      loading: followFriendLoading,
      error: followFriendError,
    },
  ] = useMutation(FOLLOW_FRIEND);

  // Query
  const { loading, error, data } = useGetPost();

  useEffect(() => {
    if (error) {
      // console.error("Error fetching posts:", error);
      toast.error(error.message);
    }

    if (data) {
      // console.log("Posts fetched successfully:", data);
      setPostData(data.getPosts ?? []);
    }
  }, [error, data]);

  useEffect(() => {
    if (followFriendError) {
      toast.error(followFriendError.message);
    }

    if (followFriendData) {
      const { message, response } = followFriendData.friendSendRequest;
      if (response) {
        toast.success(message);
      }
    }
  }, [followFriendData, followFriendLoading, followFriendError]);

  const handleFollowRequest = async (authorId: string) => {
    await friendSendRequest({
      variables: {
        receiverId: authorId,
      },
    });
  };

  const toggleComments = (postId: string) => {
    setShowComment(showComment === postId ? null : postId);
  };

  return (
    <div className="w-full min-h-screen mt-30">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        <div className="lg:col-span-1 hidden lg:block ">
          <div className="lg:sticky top-30 border bg-white rounded-xl flex gap-5">
            {" "}
            <div className="w-full m-5 h-150 flex flex-col items-center justify-between">
              <div
                className="w-full h-1/2 bg-white border cursor-pointer rounded-2xl"
                onClick={() => navigate("/profile")}
              >
                <div className="h-full flex flex-col gap-10">
                  <div className="h-1/2 flex flex-1">
                    <div className="relative flex flex-1 h-30">
                      <img
                        src="https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Profile background"
                        className="w-full h-full object-cover object-center rounded-t-2xl"
                      />
                      <div className="absolute bottom-0 left-5 transform translate-y-1/2">
                        <div className="w-24 h-24  border-2 rounded-full overflow-hidden border-white">
                          <img
                            src="https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Profile photo"
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" h-1/2 flex flex-1 flex-col px-2">
                    <h1 className="font-bold text-lg">
                      {currentUser?.user?.name}
                    </h1>
                    <p className="text-gray-800 text-sm text-wrap">
                      @
                      {currentUser?.user?.name
                        .split(" ")[0]
                        .toLocaleLowerCase()}
                    </p>
                    <span className="text-xs w-full text-wrap text-gray-600">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Incidunt fugiat beatae.
                    </span>
                  </div>
                </div>
              </div>
              <hr className="text-gray-400 w-full" />

              <div className="w-full h-60 bg-purple-200"></div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 flex flex-col gap-5 relative h-full">
          <div className="">
            <EditorComponent />
          </div>
          <hr className="text-gray-400" />
          <div className="w-full">
            {postData && postData.length > 0 ? (
              postData.map((post: postObj) => (
                <div
                  key={post.id}
                  className="w-full my-5! border rounded-xl bg-white"
                >
                  <div className="w-full h-20 flex items-center px-5! gap-5">
                    <div className="w-[10%]">
                      <div className="w-12 h-12 border rounded-full overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          alt="Profile-photo"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="flex w-[70%] flex-col">
                      <p className="font-bold text-sm w-full overflow-x-hidden">
                        {post.author.name}
                      </p>
                      <p className="font-medium text-[12px] text-gray-700 h-5 w-full overflow-y-hidden">
                        {post.author.id}
                      </p>
                      <span className="text-[10px]">
                        <span>
                          <span className="text-gray-500">2h</span> •{" "}
                        </span>
                        <span className="text-gray-500">Public</span>
                      </span>
                    </div>
                    <div className="flex w-[20%]">
                      <button
                        onClick={() => handleFollowRequest(post.author.id)}
                        className="border py-2! px-0!  rounded justify-center flex flex-1 text-sm font-medium"
                      >
                        Follow
                      </button>
                    </div>
                  </div>
                  <hr className="text-gray-400" />
                  <div className="w-full flex justify-center items-center h-full p-5!">
                    <div className="w-full flex flex-col">
                      <div className="w-full">
                        <p className="text-[15px] text-gray-900">
                          {post.content}
                        </p>
                        <div className="flex gap-2 mb-3">
                          <span className="text-blue-600">#Hello</span>
                          <span className="text-blue-600">#gameOver</span>
                          <span className="text-blue-600">#MyNewPost</span>
                          <span className="text-blue-600">#TopTrends</span>
                        </div>
                      </div>
                      <hr className="text-gray-200 my-3" />
                      <div className="flex justify-between items-center w-full">
                        <button className="text-sm font-medium w-30!  text-gray-600 hover:text-blue-600">
                          Like
                        </button>
                        <button
                          onClick={() => toggleComments(post.id)}
                          className="text-sm font-medium w-30! text-gray-600 hover:text-blue-600"
                        >
                          Comment
                        </button>
                      </div>
                      {showComment === post.id && (
                        <div className="mt-4 border-t pt-3">
                          <ShowComments />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-10 text-gray-500">
                {loading ? "Loading items..." : "No posts available."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeComponent;
