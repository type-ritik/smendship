import { useEffect } from "react";
import type { InvitationRequestInterface } from "../../utils/userInterfaces";
import { useSendFriendRequest } from "../../services/FriendService";

interface FriendCanvaProps {
  friendsList: [InvitationRequestInterface["user"]] | [];
}

export default function FriendCanva({ friendsList }: FriendCanvaProps) {
  const { loadRequest, loading, error, data } = useSendFriendRequest();

  useEffect(() => {
    if (loading) {
      console.log("Sending friend request...");
    }

    if (error) {
      console.error("Error sending friend request:", error);
    }

    if (data) {
      console.log("Friend request response:", data.friendSendRequest);
    }
  }, [loading, error, data]);

  const handleSendFriendRequest = async (receiverId: string) => {
    await loadRequest({
      variables: {
        receiverId,
      },
    });
  };

  return (
    <div className="absolute w-2xl top-15 left-60 bg-white rounded-sm border-blue-300 border">
      <div className="w-full p-5! flex flex-col gap-5">
        {friendsList.length > 0 ? (
          friendsList.map((item, index) => (
            <div
              key={index}
              id="u_profile"
              className="flex w-full px-3! py-2! items-center gap-5 justify-between border border-blue-800 rounded-sm bg-blue-300"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0  object-center justify-start border border-blue-800">
                <img
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="flex flex-col items-start justify-center flex-1">
                <h1 className="text-base font-semibold">{item.name}</h1>
                <span className="text-sm text-gray-500">
                  {item.status || "online"}
                </span>
              </div>
              <div
                className="flex justify-end items-center px-6! py-1! rounded-sm bg-blue-50 hover:text-white text-blue-500 cursor-pointer hover:bg-blue-500 hover:border border border-transparent hover:border-blue-800 transition-all duration-300"
                onClick={() => handleSendFriendRequest(item.id)}
              >
                <span className="flex">Follow</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm font-semibold text-blue-700">
            No result found!
          </div>
        )}
      </div>
    </div>
  );
}
