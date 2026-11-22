import { useParams } from "react-router-dom";
import { FiMessageCircle } from "react-icons/fi";
import ChatComponent from "./ChatComponent";
import ChatFriends from "./ChatFriends";
import { wsClient } from "../../apolloConfig";

export default function ChatBoxComponent() {
  const { id } = useParams();
  // "/chatroom/user/list" has no room selected
  const roomOpen = !!id && id !== "list";

  if (document.visibilityState === "hidden") {
    document.addEventListener("visibilitychange", () => {
      wsClient.terminate();
    });
  }

  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      wsClient.terminate();
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-0 pt-16 sm:px-6 md:pb-6 md:pt-24">
      <div className="grid h-[calc(100dvh-8rem)] md:h-[calc(100dvh-7.5rem)] md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] md:gap-4">
        {/* On phones show one pane at a time; on md+ show both */}
        <div className={`${roomOpen ? "hidden md:flex" : "flex"} min-h-0`}>
          <ChatFriends />
        </div>

        <div className={`${roomOpen ? "flex" : "hidden md:flex"} min-h-0`}>
          {roomOpen ? (
            <ChatComponent />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-teal-200 bg-white/60 text-center">
              <FiMessageCircle size={32} className="text-teal-500" />
              <p className="font-medium text-slate-700">Pick a conversation</p>
              <p className="text-sm text-slate-500">
                Your messages will show up here.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
