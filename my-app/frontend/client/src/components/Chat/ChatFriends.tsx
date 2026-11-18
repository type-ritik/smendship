import { useMemo, useState } from "react";
import { useFetchListOfMembersProfile } from "../../services/ChatRoomService";
import type { RoomInterface } from "../../utils/ChatInterface";
import { useNavigate, useParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

function ChatFriends() {
  const [search, setSearch] = useState("");
  const { loading, data, error } = useFetchListOfMembersProfile();
  const navigate = useNavigate();
  const { id: activeRoomId } = useParams();

  const rooms: RoomInterface[] = useMemo(
    () => data?.retriveChatFriends ?? [],
    [data],
  );

  // The search box used to do nothing; it now filters by name.
  const visibleRooms = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? rooms.filter((r) =>
          r?.participants?.[0]?.user?.name?.toLowerCase().includes(q),
        )
      : rooms;
  }, [rooms, search]);

  if (error) console.error("Error fetching chat room participants:", error);

  return (
    <section className="flex h-full w-full flex-col overflow-hidden border-teal-100 bg-white shadow-sm sm:rounded-2xl sm:border">
      <header className="flex flex-col gap-3 border-b border-teal-100 p-4">
        <h1 className="text-lg font-semibold text-slate-900">Chats</h1>
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            name="friend_search"
            id="friend_search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your friends"
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
          />
        </div>
      </header>

      <ul className="no-scrollbar flex-1 overflow-y-auto p-2">
        {loading ? (
          [0, 1, 2, 3].map((n) => (
            <li key={n} className="flex items-center gap-3 p-3">
              <div className="skeleton h-11 w-11 rounded-full" />
              <div className="skeleton h-4 w-1/2 rounded" />
            </li>
          ))
        ) : visibleRooms.length > 0 ? (
          visibleRooms.map((item, i) => {
            const user = item.participants?.[0]?.user;

            const active = item.id === activeRoomId;
            // const online = user?.status === "online";
            const online = true;
            return (
              <li
                key={item.id}
                className="anim-rise"
                style={{ "--i": i } as React.CSSProperties}
              >
                <button
                  onClick={() => navigate(`/chatroom/user/${item.id}`)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-teal-600 ${
                    active ? "bg-teal-100" : "hover:bg-teal-50"
                  }`}
                >
                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold uppercase text-white">
                      {user?.name[0]}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                        online ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {user?.name ?? "Unknown"}
                    </p>
                    <p
                      className={`text-xs ${online ? "text-emerald-600" : "text-slate-400"}`}
                    >
                      {user?.status}
                    </p>
                  </div>
                </button>
              </li>
            );
          })
        ) : (
          <li className="p-6 text-center text-sm text-slate-500">
            {search
              ? "No friends match that name."
              : "No chats yet. Accept a friend request to start one."}
          </li>
        )}
      </ul>
    </section>
  );
}

export default ChatFriends;
