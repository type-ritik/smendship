import { useEffect, useState } from "react";
import RequestCard from "../components/helperComponent/Card/RequestCard";
import { useQuery } from "@apollo/client";
import {
  LIST_OF_FOLLOWERS,
  LIST_OF_FOLLOWINGS,
} from "../services/InvitationService";
import toast from "react-hot-toast";

function ManageMyNetwork() {
  const [listOfFollwings, setListOfFollowings] = useState([]);
  const [listOfFollowers, setListOfFollowers] = useState([]);
  const [isFollowingActive, setIsFollowingActive] = useState(false);
  const {
    data: followingData,
    loading: followingLoading,
    error: followingError,
  } = useQuery(LIST_OF_FOLLOWINGS);

  const {
    data: followerData,
    loading: followerLoading,
    error: followerError,
  } = useQuery(LIST_OF_FOLLOWERS);

  // List of Followers
  useEffect(() => {
    if (followingError) {
      toast.loading("Loading...");
    }

    if (followingError) {
      toast.error("Error fetching followings...");
    }

    if (followingData) {
      toast.dismiss();
      const followings = followingData?.listOfFollowings;
      if (!followings || followings.length === 0) {
        toast("You are not following anyone yet. Start connecting!");
      } else {
        setListOfFollowings(followings);
      }
    }
  }, [followingData, followingError, followingLoading]);

  // List of Followings
  useEffect(() => {
    if (followerLoading) {
      toast.loading("Loading...");
    }

    if (followerError) {
      toast.error("Error fetching followers...");
    }

    if (followerData) {
      toast.dismiss();
      const followers = followerData?.listOfFollowers;
      if (!followers || followers.length === 0) {
        toast("You have no followers yet. Start connecting!");
      } else {
        setListOfFollowers(followers);
      }
    }
  }, [followerData, followerLoading, followerError]);

  return (
    <div className="flexw-full h-full mt-30!">
      <div className="p-5! w-full bg-white border rounded gap-5! flex flex-col">
        <div className="w-full flex p-5! border rounded justify-start bg-[#F0FFFF] items-center gap-5!">
          <div
            onClick={() => setIsFollowingActive(false)}
            className={`w-35 px-6! py-2! flex justify-center items-center self-center rounded hover:bg-green-200 hover:text-black cursor-pointer  h-full ${!isFollowingActive ? "bg-green-300" : ""}`}
          >
            Followers
          </div>{" "}
          <span>|</span>{" "}
          <div
            onClick={() => setIsFollowingActive(true)}
            className={`w-35 rounded px-6! py-2! flex justify-center items-center self-center hover:bg-green-200 hover:text-black cursor-pointer ${isFollowingActive ? "bg-green-300" : ""}`}
          >
            Followings
          </div>
        </div>
        <div className="w-full h-[70vh] p-5! border rounded bg-[#F0FFFF] overflow-y-scroll">
          <RequestCard
            responseCall={isFollowingActive ? "FOLLOWING" : "FOLLOWER"}
            invitationRequest={
              isFollowingActive ? listOfFollwings : listOfFollowers
            }
          />
        </div>
      </div>
    </div>
  );
}

export default ManageMyNetwork;
