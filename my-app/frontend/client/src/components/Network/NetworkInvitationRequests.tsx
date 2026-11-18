import RequestCard from "../helperComponent/Card/RequestCard";
import { useEffect, useState } from "react";
import {
  useFetchListOfReceivedFriendRequest,
  useFetchListOfSentFriendRequest,
} from "../../services/InvitationService";
import type { InvitationRequestInterface } from "../../utils/userInterfaces";
import toast from "react-hot-toast";

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="skeleton h-20 rounded-xl" />
      <div className="skeleton h-20 rounded-xl" />
    </div>
  );
}

function NetworkInvitationRequests() {
  const [isReceivedActive, setIsReceivedActive] = useState(true);

  const { data, loading, error } = useFetchListOfReceivedFriendRequest();
  const {
    data: sentData,
    loading: sentLoading,
    error: sentError,
  } = useFetchListOfSentFriendRequest();

  const received: InvitationRequestInterface[] =
    data?.getFriendRequestsListOfUser ?? [];
  const sent: InvitationRequestInterface[] =
    sentData?.getSentFriendRequestListOfUser ?? [];

  useEffect(() => {
    if (error) toast.error("Couldn't load received requests.");
  }, [error]);
  useEffect(() => {
    if (sentError) toast.error("Couldn't load sent requests.");
  }, [sentError]);

  const tabs = [
    { label: "Received", active: true, count: received.length },
    { label: "Sent", active: false, count: sent.length },
  ];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-10 pt-28 sm:px-6">
      <header className="anim-rise" style={{ "--i": 0 } as React.CSSProperties}>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Invitations
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Requests you've received and the ones you've sent.
        </p>
      </header>

      <section
        className="anim-rise flex flex-col gap-4 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm sm:p-6"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        <div
          role="tablist"
          className="relative grid grid-cols-2 rounded-xl bg-teal-50 p-1 sm:max-w-sm"
        >
          <span
            aria-hidden
            className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-white shadow transition-transform duration-300 ease-out ${
              isReceivedActive ? "translate-x-0" : "translate-x-full"
            }`}
          />
          {tabs.map(({ label, active, count }) => (
            <button
              key={label}
              role="tab"
              aria-selected={isReceivedActive === active}
              onClick={() => setIsReceivedActive(active)}
              className={`relative z-10 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isReceivedActive === active
                  ? "text-teal-700"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {label}
              <span className="rounded-full bg-teal-100 px-2 text-xs text-teal-700">
                {count}
              </span>
            </button>
          ))}
        </div>

        <div
          key={String(isReceivedActive)}
          className="anim-pop max-h-[65vh] min-h-48 overflow-y-auto rounded-xl border border-teal-100 bg-teal-50/60 p-3 sm:p-4"
        >
          {(isReceivedActive ? loading : sentLoading) ? (
            <ListSkeleton />
          ) : (
            <RequestCard
              responseCall={isReceivedActive ? "RECEIVE" : "SENT"}
              invitationRequest={isReceivedActive ? received : sent}
            />
          )}
        </div>
      </section>
    </main>
  );
}

export default NetworkInvitationRequests;
