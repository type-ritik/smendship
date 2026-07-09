import { useNavigate } from "react-router-dom";
import type { RoomMember } from "../../utils/ChatInterface";

interface ChatHeaderProp {
  roomData: RoomMember | null;
}

function ChatHeader({ roomData }: ChatHeaderProp) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4! py-3! bg-white border-b border-gray-200 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
          {roomData?.user.profile_image
            ? roomData.user.profile_image
            : roomData?.user.name[0].toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-sm leading-tight">
            {roomData?.user.name}
          </h3>
          <span className="text-xs text-emerald-600 font-medium">
            {roomData?.user.status}
          </span>
        </div>
      </div>
      <button
        onClick={() => {
          navigate("/chatroom/user/list");
        }}
        className="text-gray-500! hover:text-gray-700! px-2! py-2! rounded-full! hover:bg-gray-100! transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

export default ChatHeader;
