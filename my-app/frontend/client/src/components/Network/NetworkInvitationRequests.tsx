import { Link } from "react-router-dom";
import RequestCard from "../helperComponent/Card/RequestCard";
import { useEffect, useState, type ComponentType } from "react";
import { useQuery } from "@apollo/client";
import {
  LIST_OF_RECEIVED_FRIEND_REQUEST,
  LIST_OF_SENT_FRIEND_REQUEST,
} from "../../services/InvitationService";
import type { InvitationRequestInterface } from "../../utils/userInterfaces";
import toast from "react-hot-toast";

const RequestCardComponent = RequestCard as unknown as ComponentType<{
  isReceivedActive: number | boolean;
  invitationRequest: InvitationRequestInterface[];
}>;

function NetworkInvitationRequests() {
  const [listOfReceivedFriendRequest, setListOfReceivedFriendRequest] =
    useState<InvitationRequestInterface[]>([]);
  const [listOfSentFriendRequest, setListOfSentFriendRequest] = useState<
    InvitationRequestInterface[]
  >([]);

  const { data, loading, error } = useQuery(LIST_OF_RECEIVED_FRIEND_REQUEST);
  const {
    data: sentRequestData,
    loading: sentRequestLoading,
    error: sentRequestError,
  } = useQuery(LIST_OF_SENT_FRIEND_REQUEST);

  // List of sent friend request
  useEffect(() => {
    if (sentRequestLoading) {
      toast.loading("Loading...");
    }

    if (sentRequestError) {
      toast.error("Error fetching sent friend requests");
      toast.dismiss();
    }

    if (sentRequestData) {
      toast.dismiss();
      const requests = sentRequestData?.listOfSentFriendRequest;
      if (!requests || requests.length === 0) {
        toast("You have no friend requests yet. Start connecting!");
      } else {
        setListOfSentFriendRequest(requests);
      }
    }
  }, [sentRequestData, sentRequestError, sentRequestLoading]);

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

  const [isReceivedActive, setIsReceivedActive] = useState(true);
  return (
    <div className="w-full h-ful flex flex-col border rounded p-5! bg-white mt-30!">
      <div className="w-full h-full justify-center items-center flex flex-col gap-5">
        <div className="flex w-full gap-5 border p-4! rounded items-center bg-[#f0ffff] h-20">
          <div
            onClick={() => {
              setIsReceivedActive(true);
            }}
            className={`w-35 px-6! py-2! flex justify-center items-center self-center rounded hover:bg-green-200 hover:text-black cursor-pointer  h-full ${isReceivedActive ? "bg-green-300" : ""}`}
          >
            <h3 className="w-full flex justify-center items-center">
              <Link
                to={"/network/invitation/requests"}
                className={`w-full h-full flex justify-center items-center `}
              >
                Received
              </Link>
            </h3>
          </div>

          <span>|</span>
          <div
            className={`w-35 rounded px-6! py-2! flex justify-center items-center self-center hover:bg-green-200 hover:text-black cursor-pointer ${!isReceivedActive ? "bg-green-300" : ""}`}
            onClick={() => {
              setIsReceivedActive(false);
            }}
          >
            <h3 className="w-full flex justify-center items-center">
              <Link to={"/network/invitation/requests"} className={``}>
                Sent
              </Link>
            </h3>
          </div>
        </div>
        <div className="w-full h-170 bg-[#f0ffff] border px-5! rounded relative flex flex-col items-center overflow-y-scroll">
          <div className="absolute  w-full flex-col gap-5 flex justify-center items-center p-5!">
            <RequestCardComponent
              isReceivedActive={isReceivedActive}
              invitationRequest={
                isReceivedActive
                  ? listOfReceivedFriendRequest
                  : listOfSentFriendRequest
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NetworkInvitationRequests;
