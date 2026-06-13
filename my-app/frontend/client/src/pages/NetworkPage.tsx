import ManageMyNetworkComponent from "../components/Network/ManageMyNetworkComponent";
import InvitationComponent from "../components/Network/InvitationComponent";
import RecommendedFriend from "../components/helperComponent/RecommendedFriend";
import { useEffect, useState } from "react";
import type { InvitationRequestInterface } from "../utils/userInterfaces";
import { LIST_OF_RECEIVED_FRIEND_REQUEST } from "../services/InvitationService";
import { useQuery } from "@apollo/client";
import toast from "react-hot-toast";

function NetworkPage() {
  const [listOfReceivedFriendRequest, setListOfReceivedFriendRequest] =
    useState<InvitationRequestInterface[]>([]);

  const { data, loading, error } = useQuery(LIST_OF_RECEIVED_FRIEND_REQUEST);

  // List of received friend request
  useEffect(() => {
    if (loading) {
      toast.loading("Loading...");
    }

    if (error) {
      toast.error("Error fetching received friend requests");
      toast.dismiss();
    }

    if (data) {
      toast.dismiss();
      const requests = data?.listOfReceivedFriendRequest;
      if (!requests || requests.length === 0) {
        toast("You have no friend requests yet. Start connecting!");
      } else {
        setListOfReceivedFriendRequest(requests);
      }
    }
  }, [data, loading, error]);

  return (
    <div className="w-full flex justify-center h-full mt-25!">
      <div className="flex w-full flex-col justify-center items-center bg-white h-full p-5! rounded-xl gap-5!">
        {/* Invitation */}
        <InvitationComponent
          listOfReceivedFriendRequest={listOfReceivedFriendRequest}
        />
        <ManageMyNetworkComponent />
        <RecommendedFriend />
      </div>
    </div>
  );
}

export default NetworkPage;
