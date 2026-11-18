import { useEffect } from "react";
import RequestCard from "../components/helperComponent/Card/RequestCard";
import {
  useFetchListOfFollower,
  useFetchListOfFollowing,
} from "../services/InvitationService";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

type Tab = "follower" | "following";

const TABS: { key: Tab; label: string }[] = [
  { key: "follower", label: "Followers" },
  { key: "following", label: "Following" },
];

function ManageMyNetwork() {
  const { data: followerData, error: followerError } = useFetchListOfFollower();
  const { data: followingData, error: followingError } =
    useFetchListOfFollowing();

  const { tab } = useParams<{ tab: Tab }>();
  const navigate = useNavigate();

  // The URL is the single source of truth, so a refresh or a shared link
  // on /network/manage/following shows the right list.
  const currentTab: Tab = tab === "following" ? "following" : "follower";
  const isFollowing = currentTab === "following";

  const followers = followerData ?? [];
  const followings = followingData ?? [];

  useEffect(() => {
    if (followerError) toast.error("Couldn't load followers.");
  }, [followerError]);

  useEffect(() => {
    if (followingError) toast.error("Couldn't load following.");
  }, [followingError]);

  const counts: Record<Tab, number> = {
    follower: followers.length,
    following: followings.length,
  };

  return (
    <div className="flex relative top-25 w-full flex-col gap-4 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm sm:p-6">
      {/* Segmented tabs with a sliding indicator */}
      <div
        role="tablist"
        aria-label="Network lists"
        className="relative grid grid-cols-2 rounded-xl bg-teal-50 p-1 sm:max-w-sm"
      >
        <span
          aria-hidden
          className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-white shadow transition-transform duration-300 ease-out ${
            isFollowing ? "translate-x-full" : "translate-x-0"
          }`}
        />
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={currentTab === key}
            onClick={() => navigate(`/network/manage/${key}`)}
            className={`relative z-10 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-teal-600 ${
              currentTab === key
                ? "text-teal-700"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {label}
            <span className="rounded-full bg-teal-100 px-2 text-xs text-teal-700">
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* key re-mounts the panel so it animates on every tab switch */}
      <div
        key={currentTab}
        role="tabpanel"
        className="anim-pop max-h-[65vh] min-h-48 overflow-y-auto rounded-xl border border-teal-100 bg-teal-50/60 p-3 sm:p-5"
      >
        <RequestCard
          responseCall={isFollowing ? "FOLLOWING" : "FOLLOWER"}
          invitationRequest={isFollowing ? followings : followers}
        />
      </div>
    </div>
  );
}

export default ManageMyNetwork;
