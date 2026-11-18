import { useEffect } from "react";
import { useRetriveNotification } from "../services/NotificationService";
import type { NotifyInterface } from "../utils/NotificationInterface";

const AVATAR = "https://cdn-icons-png.flaticon.com/512/1827/1827301.png";

// `type` is a free String on the backend; these cover the known REQUEST_TYPE values.
const MESSAGES: Record<string, string> = {
  CHAT_ROOM_ACTIVATED: "activated a chat room with you.",
  FRIEND_REQUEST_SENT: "sent you a friend request.",
  FRIEND_REQUEST_ACCEPTED: "accepted your friend request.",
  FRIEND_REQUEST_REJECTED: "declined your friend request.",
};

// notifiedAt can arrive as an ISO string or an epoch number
const toTime = (value: string | number): number =>
  new Date(isNaN(Number(value)) ? value : Number(value)).getTime();

function timeAgo(value: string | number): string {
  const seconds = Math.floor((Date.now() - toTime(value)) / 1000);
  if (isNaN(seconds) || seconds < 0) return "";
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function NotificationSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-teal-100 bg-white p-3">
      <div className="skeleton h-11 w-11 rounded-full" />
      <div className="skeleton h-4 w-1/2 rounded" />
    </div>
  );
}

// Renamed from `Notification` (shadowed the browser's global Notification API).
function NotificationPage() {
  const { data, loading, error, refetch } = useRetriveNotification();

  useEffect(() => {
    if (error) console.error("Error fetching notifications:", error);
  }, [error]);

  // Query is retriveUserNotifications (was getNotification). Newest first.
  const notifications: NotifyInterface[] = [
    ...((data?.retriveUserNotifications ?? []) as NotifyInterface[]),
  ]
    .filter(Boolean)
    .sort((a, b) => toTime(b.notifiedAt) - toTime(a.notifiedAt));
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 pb-10 pt-28 sm:px-6">
      <header className="anim-rise" style={{ "--i": 0 } as React.CSSProperties}>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {loading
            ? "Checking for updates…"
            : unread > 0
              ? `${unread} unread`
              : notifications.length > 0
                ? "You're all caught up."
                : "Nothing new yet."}
        </p>
      </header>

      <section
        className="anim-rise flex min-h-[50vh] flex-col gap-3 rounded-2xl border border-teal-100 bg-white p-3 shadow-sm sm:p-5"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        {loading ? (
          <>
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </>
        ) : error ? (
          <div className="m-auto flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-red-600">
              Couldn't load notifications.
            </p>
            <button
              onClick={() => refetch()}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 active:scale-95"
            >
              Try again
            </button>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((item, i) => (
            <article
              key={item.id}
              className={`anim-rise flex items-center gap-3 rounded-xl border p-3 ${
                item.isRead
                  ? "border-teal-100 bg-white"
                  : "border-teal-200 bg-teal-50"
              }`}
              style={{ "--i": i } as React.CSSProperties}
            >
              <img
                src={AVATAR}
                alt=""
                className="h-11 w-11 shrink-0 rounded-full border-2 border-white object-cover shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">
                    {/* was item.fromUser.name: crashed when the user was null */}
                    {item.user1?.name ?? "Someone"}
                  </span>{" "}
                  {MESSAGES[item.type] ?? "sent you a notification."}
                </p>
                {item.post?.content && (
                  <p className="truncate text-xs text-slate-500">
                    {item.post.content}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-xs text-slate-400">
                  {timeAgo(item.notifiedAt)}
                </span>
                {!item.isRead && (
                  <span
                    aria-label="Unread"
                    className="h-2.5 w-2.5 rounded-full bg-teal-500"
                  />
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="m-auto flex flex-col items-center gap-1 text-center">
            <p className="text-base font-medium text-slate-700">
              No notifications yet
            </p>
            <p className="text-sm text-slate-500">
              New requests and chat updates will show up here.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default NotificationPage;
