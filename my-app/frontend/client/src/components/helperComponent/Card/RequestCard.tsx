import type { InvitationRequestInterface } from "../../../utils/userInterfaces";
import { useUpdateFriendRequestResponse } from "../../../services/InvitationService";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useChatRoomCreation } from "../../../services/ChatRoomService";
import { useNavigate } from "react-router-dom";

type RequestCardProps = {
  responseCall: string;
  invitationRequest: InvitationRequestInterface[] | [];
};

type Action = { label: string; code: string };

const EMPTY_TEXT: Record<string, string> = {
  RECEIVE: "No received invitations yet.",
  SENT: "No sent invitations yet.",
  FOLLOWER: "No followers yet.",
  FOLLOWING: "You're not following anyone yet.",
};

// Which buttons each list shows. "secondary" is the quieter/negative action.
function actionsFor(responseCall: string): {
  secondary: Action;
  primary?: Action;
} {
  switch (responseCall) {
    case "RECEIVE":
      return {
        secondary: { label: "Reject", code: "REJECT" },
        primary: { label: "Accept", code: "ACCEPT" },
      };
    case "SENT":
      return { secondary: { label: "Cancel", code: "REVOKE" } };
    case "FOLLOWING":
      return {
        secondary: { label: "Unfollow", code: "UNFOLLOW" },
        primary: { label: "Chat", code: "CHAT" },
      };
    default:
      return {
        secondary: { label: "Remove", code: "REVOKE" },
        primary: { label: "Chat", code: "CHAT" },
      };
  }
}

function RequestCard({ responseCall, invitationRequest }: RequestCardProps) {
  const navigate = useNavigate();
  const [handledIds, setHandledIds] = useState<Set<string>>(new Set());

  const { friendRequestResponse, data, loading, error } =
    useUpdateFriendRequestResponse();
  const {
    createChatSpace,
    data: chatData,
    loading: chatLoading,
    error: chatError,
  } = useChatRoomCreation();

  useEffect(() => {
    if (chatError) toast.error("Couldn't open the chat. Try again.");
    if (chatData) navigate(`/chatroom/user/${chatData.createChatSpace.id}`);
  }, [chatData, chatError, navigate]);

  // One toast id, so loading -> success/error replaces itself.
  useEffect(() => {
    if (loading) toast.loading("Working…", { id: "request-response" });
    else if (error)
      toast.error("Couldn't respond to that request.", {
        id: "request-response",
      });
    else if (data)
      toast.success(data.resolveFriendRequest.response, {
        id: "request-response",
      });
  }, [data, loading, error]);

  const handleRequestResponse = async (
    item: InvitationRequestInterface,
    code: string,
  ) => {
    try {
      switch (code) {
        case "ACCEPT":
        case "REJECT":
          await friendRequestResponse({
            variables: {
              requestId: item.id,
              response: code === "ACCEPT" ? true : false,
            },
          });
          // Hide the card once answered
          setHandledIds((prev) => new Set(prev).add(item.id));
          break;
        case "CHAT":
          await createChatSpace({
            variables: {
              receiverId: item.followers?.id
                ? item.followers?.id
                : item.followings?.id,
            },
          });
          break;
        default:
          // UNFOLLOW / REVOKE have no mutation wired up yet (same as before)
          toast.error("That action isn't available yet.");
      }
    } catch {
      /* errors are surfaced by the effects above */
    }
  };

  const visible = (invitationRequest as InvitationRequestInterface[]).filter(
    (item) => !handledIds.has(item.id),
  );
  const { secondary, primary } = actionsFor(responseCall);
  const busy = loading || chatLoading;

  if (visible.length === 0) {
    return (
      <p className="w-full py-8 text-center text-sm text-slate-500">
        {EMPTY_TEXT[responseCall] ?? "Nothing here yet."}
      </p>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-3">
      {visible.map((item, i) => {
        const user = item.sender
          ? item.sender
          : item.receiver
            ? item.receiver
            : item.followers
              ? item.followers
              : item.followings;
        const online = user?.status === "online";
        return (
          <li
            key={user?.id}
            className="anim-rise flex flex-col gap-3 rounded-xl border border-teal-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center"
            style={{ "--i": i } as React.CSSProperties}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="relative shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 font-semibold uppercase text-white">
                  {user?.name}
                </div>
                {user?.status && (
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      online ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-slate-900">
                  {user?.name}
                </h3>
                {user?.status && (
                  <p
                    className={`text-xs ${online ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    {user?.status}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 sm:shrink-0">
              <button
                disabled={busy}
                onClick={() => handleRequestResponse(item, secondary.code)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 active:scale-95 disabled:opacity-60 sm:flex-none"
              >
                {secondary.label}
              </button>
              {primary && (
                <button
                  disabled={busy}
                  onClick={() => handleRequestResponse(item, primary.code)}
                  className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 active:scale-95 disabled:opacity-60 sm:flex-none"
                >
                  {primary.label}
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default RequestCard;
