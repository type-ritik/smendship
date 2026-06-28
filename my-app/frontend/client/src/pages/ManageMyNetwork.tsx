import { useEffect, useState } from "react";
import RequestCard from "../components/helperComponent/Card/RequestCard";
import {
  useFetchListOfFollower,
  useFetchListOfFollowing,
} from "../services/InvitationService";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

function ManageMyNetwork() {
  const [listOfFollowings, setListOfFollowings] = useState([]);
  const [listOfFollowers, setListOfFollowers] = useState([]);
  const [isFollowingActive, setIsFollowingActive] = useState(false);

  const { data: followerData, error: followerError } = useFetchListOfFollower();
  const { data: followingData, error: followingError } =
    useFetchListOfFollowing();

  const { tab } = useParams<{ tab: "follower" | "following" }>();
  const currentTab = tab || "follower";
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFollowingActive) {
      if (followerError) {
        toast.error("Error fetching followers");
      }
      if (followerData) {
        setListOfFollowers(followerData.listOfFollowers);
      }
    } else {
      if (followingError) {
        toast.error("Error fetching followings");
      }
      if (followingData) {
        setListOfFollowings(followingData.listOfFollowings);
      }
    }
  }, [
    isFollowingActive,
    followerData,
    followingData,
    followingError,
    followerError,
  ]);

  return (
    <div className="flex w-full h-full mt-30!">
      <div className="p-5! w-full bg-white border rounded gap-5! flex flex-col">
        <div className="w-full flex p-5! border rounded justify-start bg-[#F0FFFF] items-center gap-5!">
          <div
            onClick={() => {
              setIsFollowingActive(false);
              navigate("/network/manage/follower");
            }}
            className={`w-35 px-6! py-2! flex justify-center items-center self-center rounded hover:bg-green-200 hover:text-black cursor-pointer  h-full ${currentTab === "follower" ? "bg-green-300" : ""}`}
          >
            Followers
          </div>{" "}
          <span>|</span>{" "}
          <div
            onClick={() => {
              setIsFollowingActive(true);
              navigate("/network/manage/following");
            }}
            className={`w-35 rounded px-6! py-2! flex justify-center items-center self-center hover:bg-green-200 hover:text-black cursor-pointer ${currentTab === "following" ? "bg-green-300" : ""}`}
          >
            Followings
          </div>
        </div>
        <div className="w-full h-[70vh] p-5! border rounded bg-[#F0FFFF] overflow-y-scroll">
          <RequestCard
            responseCall={isFollowingActive ? "FOLLOWING" : "FOLLOWER"}
            invitationRequest={
              isFollowingActive ? listOfFollowings : listOfFollowers
            }
          />
        </div>
      </div>
    </div>
  );
}

export default ManageMyNetwork;
