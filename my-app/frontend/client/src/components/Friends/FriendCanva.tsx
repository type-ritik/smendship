import { useState } from "react";
import toast from "react-hot-toast";
import type { InvitationRequestInterface } from "../../utils/userInterfaces";
import { useSendFriendRequest } from "../../services/FriendService";

type Person = InvitationRequestInterface["user"];

interface FriendCanvaProps {
  friendsList: Person[];
  loading?: boolean;
}

const AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

export default function FriendCanva({
  friendsList,
  loading,
}: FriendCanvaProps) {
  const { loadRequest } = useSendFriendRequest();
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleSendFriendRequest = async (receiverId: string) => {
    setPendingId(receiverId);
    try {
      await loadRequest({ variables: { receiverId } });
      setSentIds((prev) => new Set(prev).add(receiverId));
      toast.success("Request sent");
    } catch (err) {
      toast.error((err as Error).message || "Couldn't send the request.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="anim-pop absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-teal-100 bg-white p-2 shadow-xl sm:min-w-96">
      {loading && friendsList.length === 0 ? (
        <div className="flex flex-col gap-2 p-2">
          <div className="skeleton h-10 rounded-lg" />
          <div className="skeleton h-10 rounded-lg" />
        </div>
      ) : friendsList.length > 0 ? (
        <ul className="flex flex-col">
          {friendsList.map((item) => {
            const sent = sentIds.has(item.id);
            return (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-teal-50"
              >
                <img
                  src={AVATAR}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.status || "online"}
                  </p>
                </div>
                <button
                  onClick={() => handleSendFriendRequest(item.id)}
                  disabled={sent || pendingId === item.id}
                  className="rounded-full border border-teal-600 px-4 py-1 text-xs font-semibold text-teal-700 transition hover:bg-teal-600 hover:text-white active:scale-95 disabled:cursor-default disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {sent
                    ? "Sent"
                    : pendingId === item.id
                      ? "Sending…"
                      : "Follow"}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="p-4 text-center text-sm text-slate-500">
          No one found. Try a different name.
        </p>
      )}
    </div>
  );
}
