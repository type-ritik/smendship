import { useNavigate } from "react-router-dom";
import EditorComponent from "../Editor/EditorComponent";
import { useSelector } from "react-redux";
import type { UserObjState } from "../../utils/userInterfaces";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { FOLLOW_FRIEND, GET_POSTS } from "../../services/HomeService";
import toast from "react-hot-toast";
import type { postObj, postState } from "../../utils/postInterfaces";

function HomeComponent() {
  const { currentUser } = useSelector((state: UserObjState) => state.user);
  const { loading, error, data } = useQuery<postState>(GET_POSTS);
  const [postData, setPostData] = useState<postObj[]>([]);
  const [
    friendSendRequest,
    {
      data: followFriendData,
      loading: followFriendLoading,
      error: followFriendError,
    },
  ] = useMutation(FOLLOW_FRIEND);

  const navigate = useNavigate();

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
    // Implement the logic to send a follow request to the author with the given authorId
    // You can use a mutation from your GraphQL API to send the follow request
    // For example, you might have a mutation like `friendSendRequest` that takes the receiverId as an argument
    // You can call this mutation here and handle the response accordingly
  };

  return (
    <div className="w-full h-screen">
      <div className="w-full flex justify-evenly relative">
        <div className="w-1/5 h-200 fixed left-50 border bg-white rounded flex justify-center">
          {" "}
          <div className="w-full bg-orange-50 m-5! flex flex-col items-center gap-5">
            <div
              className="w-full h-80 bg-white border cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <div className="w-full h-40">
                <div className="profile-header w-full h-40">
                  <div className="relative w-full h-30">
                    <img
                      src="https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Profile background"
                      className="w-full h-full object-cover object-center"
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
                <div className="profile-body w-full h-40">
                  <div className="w-[90%] flex flex-col justify-center mx-5! my-2!">
                    <h1 className="font-bold text-2xl">
                      {currentUser?.user?.name}
                    </h1>
                    <p className="text-gray-800 text-sm">
                      {currentUser?.user?.id}
                    </p>
                    <span className="text-[12px] w-full font-normal text-gray-600">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Incidunt fugiat beatae necessitatibus, sapiente rerum
                    </span>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
            <div className="w-full h-60 bg-purple-200"></div>
          </div>
        </div>
        <div className="w-1/3 flex flex-col right-150">
          <EditorComponent />
          <hr className="mt-5! text-gray-400" />
          <div className="w-full">
            {/* <h1 className="font-bold text-2xl">Posts</h1> */}
            {!loading && postData.length > 0
              ? postData.map((post: postObj) => (
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
                            <span className="text-gray-500">2h</span>{" "}
                            &#8226;{" "}
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
                          <div className="flex gap-2">
                            <span className="text-blue-600">#Hello</span>
                            <span className="text-blue-600">#gameOver</span>
                            <span className="text-blue-600">#MyNewPost</span>
                            <span className="text-blue-600">#TopTrends</span>
                          </div>
                        </div>
                        <div className="w-full h-full overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt=""
                            className="w-full h-full object-cover object-center rounded"
                          />
                        </div>
                        <hr className="text-gray-400 my-5!" />
                        <div className="flex w-full justify-between">
                          <div className="w-1/4 flex justify-start">
                            <button className="px-4! justify-center flex flex-1 py-2! border rounded text-sm font-medium">
                              Like
                            </button>
                          </div>
                          <div className="w-1/4 flex justify-center">
                            <button className="px-4! justify-center flex flex-1 py-2! border rounded text-sm font-medium">
                              Comment
                            </button>
                          </div>
                          <div className="w-1/4 flex justify-end-safe">
                            <button className="px-4! justify-center flex flex-1 py-2! border rounded text-sm font-medium">
                              Impression
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeComponent;
