import { useNavigate } from "react-router-dom";
import EditorComponent from "../Editor/EditorComponent";
import { useSelector } from "react-redux";
import type { UserObjState } from "../../utils/userInterfaces";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { FOLLOW_FRIEND } from "../../services/HomeService";
import toast from "react-hot-toast";
import type { postObj } from "../../utils/postInterfaces";
import ShowComments from "../Comment/ShowComments";
import { useEntirePost } from "../../services/PostService";
import { FiHeart, FiMessageCircle } from "react-icons/fi";

const AVATAR =
  "https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const delay = (i: number) => ({ "--i": i }) as React.CSSProperties;

function PostSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-teal-100 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="skeleton h-11 w-11 rounded-full" />
        <div className="skeleton h-4 w-1/3 rounded" />
      </div>
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
    </div>
  );
}

function HomeComponent() {
  const navigate = useNavigate();
  const [showComment, setShowComment] = useState<string | null>(null);
  const [liked, setLiked] = useState<Set<string>>(new Set()); // local only for now
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  const { currentUser } = useSelector((state: UserObjState) => state.user);
  const [friendSendRequest, { loading: followLoading }] =
    useMutation(FOLLOW_FRIEND);
  const user = currentUser?.user;

  const { loadEntirePost } = useEntirePost();
  const [posts, setPosts] = useState<postObj[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  const fetchPosts = useCallback(async (cursor?: string | null) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const { data } = await loadEntirePost({
        variables: { lastPostId: cursor },
      });
      const postData = data.fetchMePosts.posts;
      setPosts((prev) => [...prev, ...postData]);
      setNextCursor(data?.fetchMePosts?.nextCursor);
      setHasInitialized(true);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [loadEntirePost]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (!hasInitialized || nextCursor === null) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          fetchPosts(nextCursor);
        }
      },
      {
        rootMargin: "200px",
      },
    );

    const currentTarget = bottomRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasInitialized, nextCursor, isLoading, fetchPosts]);

  // const postData: postObj[] = data?.getPostsByUserId ?? [];

  // useEffect(() => {
  //   if (error)
  //     toast.error("You don't have any messages.", { id: "posts-error" });
  // }, [error]);

  const handleFollowRequest = async (authorId: string) => {
    try {
      const { data: res } = await friendSendRequest({
        variables: { receiverId: authorId },
      });
      const { message, response } = res.friendSendRequest;
      if (response) {
        toast.success(message);
        setFollowedIds((prev) => new Set(prev).add(authorId));
      }
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleTimeStamp = (time: Date | string | number): string => {
    const today = new Date();
    const postTime = new Date(time);

    // Calculate the difference in milliseconds
    const diffInMs = today.getTime() - postTime.getTime();

    // Handle edge cases where postTime might be slightly in the future due to clock sync
    if (diffInMs < 0) {
      return "Just now";
    }

    // Convert milliseconds into time units
    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // 1. If the post was made today (less than 24 hours ago)
    if (days < 1) {
      if (hours > 0) {
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
      }
      if (minutes > 0) {
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
      }
      return seconds <= 5 ? "Just now" : `${seconds} seconds ago`;
    }

    // 2. If it's been between 1 and 7 days
    if (days <= 7) {
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }

    // 3. After 7 days, return the month (and day/year if needed)
    return postTime.toLocaleDateString("en-US", {
      month: "short", // e.g., "Nov" (use "long" for "November")
      day: "numeric", // e.g., "17"
      // Include the year only if the post wasn't made in the current year
      ...(postTime.getFullYear() !== today.getFullYear() && {
        year: "numeric",
      }),
    });
  };

  const toggleLike = (postId: string) =>
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });

  const toggleComments = (postId: string) =>
    setShowComment((current) => (current === postId ? null : postId));

  return (
    <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 pb-10 pt-24 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* Profile summary (desktop only) */}
      <aside className="hidden lg:block">
        <button
          onClick={() => navigate("/profile")}
          className="anim-rise sticky top-24 w-full overflow-hidden rounded-2xl border border-teal-100 bg-white text-left shadow-sm transition hover:shadow-md"
          style={delay(0)}
        >
          <div className="h-24 bg-linear-to-r from-teal-400 via-emerald-300 to-sky-300" />
          <div className="px-5 pb-5">
            <img
              src={AVATAR}
              alt=""
              className="-mt-10 h-20 w-20 rounded-full border-4 border-white object-cover"
            />
            <h2 className="mt-2 truncate text-lg font-semibold text-slate-900">
              {user?.name}
            </h2>
            <p className="text-sm text-slate-500">
              @{user?.name.split(" ")[0].toLowerCase()}
            </p>
            <p className="mt-3 text-xs text-slate-500">
              View your profile, posts and connections.
            </p>
          </div>
        </button>
      </aside>

      {/* Feed */}
      <section className="flex min-w-0 flex-col gap-5">
        <div className="anim-rise" style={delay(1)}>
          <EditorComponent />
        </div>

        {isLoading && posts.length === 0 ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length > 0 ? (
          posts.map((post: postObj, i) => {
            const isMine = post?.author?.id === user?.id;
            const authorId = post?.author?.id;
            const followed = authorId ? followedIds.has(authorId) : false;
            const postedAt = handleTimeStamp(post.createdAt);
            const isLiked = liked.has(post.id);
            return (
              <article
                key={post.id}
                className="anim-rise -z-1 rounded-2xl border border-teal-100 bg-white shadow-sm"
                style={delay(Math.min(i, 6) + 2)}
              >
                <header className="flex items-center gap-3 p-4 sm:px-5">
                  <img
                    src={AVATAR}
                    alt=""
                    className="h-11 w-11 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {post?.author?.name}
                    </p>
                    <p className="text-xs text-slate-500 flex gap-2">
                      <span className="text-xs font-semibold">{postedAt}</span>
                      Public
                    </p>
                  </div>
                  {!isMine && (
                    <button
                      onClick={() => authorId && handleFollowRequest(authorId)}
                      disabled={!authorId || followed || followLoading}
                      className="rounded-full border border-teal-600 px-4 py-1.5 text-sm font-medium text-teal-700 transition hover:bg-teal-600 hover:text-white active:scale-95 disabled:cursor-default disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      {followed ? "Requested" : "Follow"}
                    </button>
                  )}
                </header>

                <div className="border-t border-teal-50 px-4 py-4 sm:px-5">
                  {post.title && (
                    <h3 className="mb-1 text-base font-semibold text-slate-900">
                      {post.title}
                    </h3>
                  )}
                  <p className="whitespace-pre-wrap wrap-break-word text-[15px] leading-relaxed text-slate-800">
                    {post.content}
                  </p>
                </div>

                <footer className="flex border-t border-teal-50 px-2 py-1">
                  <button
                    onClick={() => toggleLike(post.id)}
                    aria-pressed={isLiked}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition hover:bg-teal-50 active:scale-95 ${
                      isLiked ? "text-rose-600" : "text-slate-600"
                    }`}
                  >
                    <FiHeart
                      className={`transition-transform ${isLiked ? "scale-125 fill-current" : ""}`}
                    />
                    Like
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    aria-expanded={showComment === post.id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-slate-600 transition hover:bg-teal-50 active:scale-95"
                  >
                    <FiMessageCircle />
                    Comment
                  </button>
                </footer>

                {showComment === post.id && (
                  <div className="anim-pop border-t border-teal-50 px-4 pb-4 sm:px-5">
                    <ShowComments />
                  </div>
                )}
              </article>
            );
          })
        ) : (
          <p className="py-10 text-center text-sm text-slate-500">
            No posts yet. Be the first to share something.
          </p>
        )}
      </section>
    </main>
  );
}

export default HomeComponent;
