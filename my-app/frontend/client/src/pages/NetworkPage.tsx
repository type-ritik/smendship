import ManageMyNetworkComponent from "../components/Network/ManageMyNetworkComponent";
import InvitationComponent from "../components/Network/InvitationComponent";
// import RecommendedFriend from "../components/helperComponent/RecommendedFriend";
import { useEffect, useState } from "react";
import type { InvitationRequestInterface } from "../utils/userInterfaces";
import { useFetchListOfReceivedFriendRequest } from "../services/InvitationService";
import toast from "react-hot-toast";

const TOAST_ID = "received-requests";

function NetworkPage() {
  const [listOfReceivedFriendRequest, setListOfReceivedFriendRequest] =
    useState<InvitationRequestInterface[]>([]);

  const { data, loading, error } = useFetchListOfReceivedFriendRequest();

  useEffect(() => {
    if (loading) {
      toast.loading("Loading requests…", { id: TOAST_ID });
      return;
    }

    if (error) {
      toast.error("Couldn't load friend requests. Try again.", {
        id: TOAST_ID,
      });
      return;
    }

    if (data) {
      toast.dismiss(TOAST_ID);

      if (data.length === 0) {
        // Only update state if it isn't already empty to prevent unnecessary re-renders
        setListOfReceivedFriendRequest((prev) =>
          prev.length === 0 ? prev : [],
        );
        toast("No friend requests yet. Start connecting!", {
          id: "empty-requests",
        });
      } else {
        setListOfReceivedFriendRequest(data.getFriendRequestsListOfUser);
      }
    }
  }, [data, loading, error]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-10 pt-28 sm:px-6">
      <header className="anim-rise" style={{ "--i": 0 } as React.CSSProperties}>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          My network
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Respond to requests and manage the people you follow.
        </p>
      </header>

      <section
        className="anim-rise rounded-2xl border border-teal-100 bg-white p-4 shadow-sm sm:p-6"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        <InvitationComponent
          listOfReceivedFriendRequest={listOfReceivedFriendRequest}
        />
      </section>

      <section
        className="anim-rise"
        style={{ "--i": 2 } as React.CSSProperties}
      >
        <ManageMyNetworkComponent />
      </section>

      {/* <RecommendedFriend /> */}
    </main>
  );
}

export default NetworkPage;
