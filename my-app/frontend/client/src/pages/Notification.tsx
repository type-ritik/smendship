import { useEffect } from "react";
import { useRetriveNotification } from "../services/NotificationService";
import type { NotifyInterface } from "../utils/NotificationInterface";

const AVATAR = "https://cdn-icons-png.flaticon.com/512/1827/1827301.png";

const MESSAGES: Record<string, string> = {
  CHAT_ROOM_ACTIVATED: "activated a chat room with you.",
};

function NotificationSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-teal-100 bg-white p-3">
      <div className="skeleton h-11 w-11 rounded-full" />
      <div className="skeleton h-4 w-1/2 rounded" />
    </div>
  );
}

function Notification() {
  const { data, loading, error } = useRetriveNotification();

  useEffect(() => {
    if (error) console.error("Error fetching notifications:", error);
  }, [error]);

  const notifications: NotifyInterface[] = data?.getNotification ?? [];

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 pb-10 pt-28 sm:px-6">
      <header className="anim-rise" style={{ "--i": 0 } as React.CSSProperties}>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {loading
            ? "Checking for updates…"
            : notifications.length > 0
              ? `${notifications.length} update${notifications.length > 1 ? "s" : ""}`
              : "You're all caught up."}
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
          <p className="m-auto text-center text-sm text-red-600">
            Couldn't load notifications. Refresh the page to try again.
          </p>
        ) : notifications.length > 0 ? (
          notifications.map((item, i) => (
            <article
              key={item.id}
              className="anim-rise flex cursor-pointer items-center gap-3 rounded-xl border border-teal-100 bg-teal-50/60 p-3 transition hover:-translate-y-0.5 hover:bg-teal-50 hover:shadow-md"
              style={{ "--i": i } as React.CSSProperties}
            >
              <img
                src={AVATAR}
                alt=""
                className="h-11 w-11 shrink-0 rounded-full border-2 border-white object-cover shadow-sm"
              />
              <p className="min-w-0 text-sm text-slate-700">
                <span className="font-semibold text-slate-900">
                  {item.fromUser.name}
                </span>{" "}
                {MESSAGES[item.type] ?? "sent you a notification."}
              </p>
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

export default Notification;
