import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiX } from "react-icons/fi";
import type { RoomMember } from "../../utils/ChatInterface";

interface ChatHeaderProp {
  roomData: RoomMember | null;
}

function ChatHeader({ roomData }: ChatHeaderProp) {
  const navigate = useNavigate();
  const user = roomData?.user;
  const online = user?.status === "online";

  return (
    <header className="z-10 flex items-center gap-3 border-b border-teal-100 bg-white px-3 py-3 sm:px-4">
      {/* Back arrow on phones, close icon on larger screens */}
      <button
        onClick={() => navigate("/chatroom/user/list")}
        aria-label="Back to chats"
        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 md:order-last md:ml-auto"
      >
        <FiArrowLeft className="md:hidden" size={20} />
        <FiX className="hidden md:block" size={20} />
      </button>

      <div className="relative">
        {user?.profile_image ? (
          <img
            src={user.profile_image}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
            {user?.name[0].toUpperCase()}
          </div>
        )}
        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
            online ? "bg-emerald-500" : "bg-slate-300"
          }`}
        />
      </div>

      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold leading-tight text-slate-900">
          {user?.name}
        </h2>
        <p
          className={`text-xs font-medium ${online ? "text-emerald-600" : "text-slate-400"}`}
        >
          {user?.status}
        </p>
      </div>
    </header>
  );
}

export default ChatHeader;
