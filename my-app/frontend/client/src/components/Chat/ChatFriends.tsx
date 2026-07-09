import { useEffect, useState } from "react";
import { useListOfChatRoomParticipant } from "../../services/ChatRoomService";
import type { RoomInterface } from "../../utils/ChatInterface";
import { useNavigate } from "react-router-dom";

function ChatFriends() {
  const [rooms, setRooms] = useState<RoomInterface[]>([]);
  const { loading, data, error } = useListOfChatRoomParticipant();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      console.log("Loading chat room participants...");
    }

    if (error) {
      console.error("Error fetching chat room participants:", error);
    }

    if (data) {
      setRooms(data.userChatRoomId);
    }
  }, [loading, error, data]);

  return (
    <div className="flex flex-col h-fullmax-w-2xl mx-auto border border-gray-200 w-full rounded-2xl shadow-lg bg-[#efeae2] overflow-hidden">
      <div className="flex justify-center items-center w-full p-6! bg-white border-b ">
        <h2 className="flex">
          <span className="text-sm! font-semibold uppercase">Friends</span>
        </h2>
      </div>
      <div className="flex justify-between gap-5 flex-col items-center w-full p-5! bg-white border-t-[#f0ffff] h-full">
        <div className="w-full">
          <input
            type="search"
            name="friend_search"
            id="friend_search"
            className="text-sm! flex-1 flex outline-none bg-[#efeae2] border-black! text-gray-700!"
            placeholder="Search your friend"
          />
        </div>
        <div className="relative w-full h-full rounded bg-[#efeae2] overflow-y-scroll border no-scrollbar">
          <ul className="flex flex-col gap-5 w-full p-5! absolute top-0 left-0">
            {rooms &&
              rooms.map((item, index) => (
                <li
                  key={index}
                  onClick={() => navigate(`/chatroom/user/${item.chatroomId}`)}
                  className="flex items-center gap-5 w-full p-3! bg-white rounded-sm shadow-xs shadow-black cursor-pointer"
                >
                  <div className="flex justify-center items-center w-10 h-10 bg-[#f0ffff] rounded-full shadow-xs shadow-black">
                    <span className="text-sm font-semibold uppercase">
                      {item.participants.user.name[0]}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold uppercase">
                      {item.participants.user.name}
                    </span>
                    <span
                      className={`text-xs ${item.participants.user.status === "online" ? "text-emerald-400" : "text-gray-400"}`}
                    >
                      {item.participants.user.status}
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ChatFriends;
