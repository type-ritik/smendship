import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../redux/user/userSlice";
import type { UserObjState } from "../utils/userInterfaces";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import EditProfile from "../components/helperComponent/Card/EditProfile";
import { useNavigate } from "react-router-dom";
import { useGetPost } from "../services/PostService";
import type { postState } from "../utils/postInterfaces";
import { useApolloClient, useQuery } from "@apollo/client";
import { FOLLOWERS_COUNT, FOLLOWINGS_COUNT } from "../services/FriendService";

const CURRENT_STATE = {
  MY_POST: "MY_POST",
  LIKED_POST: "LIKED_POST",
  COMMENT_POST: "COMMENT_POST",
} as const;

type CurrentState = (typeof CURRENT_STATE)[keyof typeof CURRENT_STATE];

const TABS: { key: CurrentState; label: string }[] = [
  { key: CURRENT_STATE.MY_POST, label: "My posts" },
  { key: CURRENT_STATE.LIKED_POST, label: "Liked" },
  { key: CURRENT_STATE.COMMENT_POST, label: "Commented" },
];

const AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const delay = (i: number) => ({ "--i": i }) as React.CSSProperties;

// Placeholder rows for the Liked / Commented tabs (replace with real queries later)
const PLACEHOLDERS = [1, 2, 3, 4, 5];

function StatButton({
  label,
  value,
  onClick,
}: {
  label: string;
  value: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-1 flex-col items-center rounded-xl px-4 py-2 transition hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-teal-600"
    >
      <span className="text-xl font-semibold text-slate-900 transition-transform group-hover:scale-110">
        {value}
      </span>
      <span className="text-xs text-slate-500">{label}</span>
    </button>
  );
}

function PostSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-teal-100 bg-white p-4">
      <div className="skeleton h-4 w-2/5 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
    </div>
  );
}

function PlaceholderPost({ withBody }: { withBody?: boolean }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-teal-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <img
          src={AVATAR}
          alt=""
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            Lorem ipsum dolor sit consectetur elit.
          </h3>
          <p className="text-xs text-slate-500">
            Posted by <span className="text-teal-700">Milo Kibo</span> · 12 July
            2023
          </p>
        </div>
        <button className="text-sm font-semibold text-teal-700 hover:underline">
          Follow
        </button>
      </div>
      {withBody && (
        <p className="text-sm text-slate-700">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
          voluptatibus, quod, quia, quos voluptates quibusdam.
        </p>
      )}
      <footer className="flex justify-between border-t border-teal-50 pt-2 text-xs text-slate-500">
        <span>Likes: 20</span>
        {withBody && <span>Views: 50</span>}
      </footer>
    </article>
  );
}

function ProfilePage() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<CurrentState>(
    CURRENT_STATE.MY_POST,
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apollo = useApolloClient();
  const { currentUser } = useSelector((state: UserObjState) => state.user);
  const userId = currentUser?.user?.id ?? "";

  const { data: frData, error: frError } = useQuery(FOLLOWERS_COUNT);
  const { data: fgData, error: fgError } = useQuery(FOLLOWINGS_COUNT);

  const { loading, error, data } = useGetPost(userId);

  // Derived straight from query results; no mirrored state needed.
  const followers: number = frData?.getFollowersCount?.count ?? 0;
  const followings: number = fgData?.getFollowingsCount?.count ?? 0;
  const postData = data as postState | undefined;

  // getPosts returns every post, so keep only the ones this user wrote
  const myPosts = (postData?.getPostsByUserId ?? []).filter(
    (p) => p.author?.id === userId,
  );

  const handleLogout = async () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("email");
    dispatch(logOut());
    await apollo.clearStore();
  };

  if (frError) console.log("Error fetching followers count:", frError.message);
  if (fgError) console.log("Error fetching followings count:", fgError.message);
  if (error) console.log(error.message);

  const activeIndex = TABS.findIndex((t) => t.key === currentComponent);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 pb-10 pt-28 sm:px-6">
      {/* Profile header */}
      <section
        className="anim-rise relative flex flex-col items-center gap-5 rounded-2xl border border-teal-100 bg-white p-5 shadow-sm sm:flex-row sm:p-6"
        style={delay(0)}
      >
        <button
          aria-label="Edit profile"
          onClick={() => setIsEditOpen(true)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:rotate-12 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-teal-600"
        >
          <FiEdit />
        </button>

        <div className="avatar-ring spin-once shrink-0 rounded-full p-1">
          <img
            src={AVATAR}
            alt="Your profile"
            className="h-24 w-24 rounded-full border-4 border-white bg-white object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-4 sm:items-start">
          <div className="min-w-0 text-center sm:text-left">
            <h1 className="truncate text-xl font-semibold text-slate-900">
              {currentUser?.user.name}
            </h1>
            <p className="truncate text-sm text-slate-500">
              {currentUser?.user.email}
            </p>
          </div>
          <div className="flex w-full max-w-xs divide-x divide-teal-100 rounded-xl border border-teal-100">
            <StatButton
              label="Followers"
              value={followers}
              onClick={() => navigate("/network/manage/follower")}
            />
            <StatButton
              label="Following"
              value={followings}
              onClick={() => navigate("/network/manage/following")}
            />
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-slate-500 transition hover:text-red-600"
          >
            Log out
          </button>
        </div>
      </section>

      {isEditOpen && (
        <EditProfile
          isAlterProfileEnable={isEditOpen}
          setIsAlterProfileEnable={setIsEditOpen}
        />
      )}

      {/* Content tabs */}
      <section
        className="anim-rise flex flex-col gap-4 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm sm:p-6"
        style={delay(1)}
      >
        <div
          role="tablist"
          className="relative grid grid-cols-3 rounded-xl bg-teal-50 p-1"
        >
          <span
            aria-hidden
            className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-lg bg-white shadow transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={currentComponent === key}
              onClick={() => setCurrentComponent(key)}
              className={`relative z-10 rounded-lg px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-teal-600 ${
                currentComponent === key
                  ? "text-teal-700"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* key restarts the stagger whenever the tab changes */}
        <div key={currentComponent} className="flex flex-col gap-3">
          {currentComponent === CURRENT_STATE.MY_POST ? (
            loading ? (
              <>
                <PostSkeleton />
                <PostSkeleton />
              </>
            ) : myPosts.length ? (
              myPosts.map((item, i) => (
                <article
                  key={item.id}
                  className="anim-rise flex flex-col gap-3 rounded-xl border border-teal-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                  style={delay(i)}
                >
                  <header className="border-b border-teal-50 pb-2">
                    <h2 className="text-base font-semibold text-slate-900">
                      {item.title}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Posted by{" "}
                      <span className="text-teal-700">{item.author?.name}</span>
                    </p>
                  </header>
                  <p className="text-sm text-slate-700">{item.content}</p>
                  <footer className="flex justify-between border-t border-teal-50 pt-2 text-xs text-slate-500">
                    <span>Likes: 20</span>
                    <span>Comments: 30</span>
                  </footer>
                </article>
              ))
            ) : (
              <p className="py-10 text-center text-sm text-slate-500">
                You haven't posted yet. Share your first post to see it here.
              </p>
            )
          ) : (
            PLACEHOLDERS.map((n, i) => (
              <div key={n} className="anim-rise" style={delay(i)}>
                <PlaceholderPost
                  withBody={currentComponent === CURRENT_STATE.COMMENT_POST}
                />
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
