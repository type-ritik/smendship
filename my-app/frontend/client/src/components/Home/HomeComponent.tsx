import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";

import EditorComponent from "../Editor/EditorComponent";
import PostCard from "../Post/PostCard";
import type { FeedPost, FollowState } from "../Post/PostCard";

import type { UserObjState } from "../../utils/userInterfaces";
import type { postObj } from "../../utils/postInterfaces";
import { FOLLOW_FRIEND } from "../../services/HomeService";
import { useEntirePost } from "../../services/PostService";

const AVATAR =
  "https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const delay = (index: number) =>
  ({ "--i": index }) as CSSProperties;

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

  const { currentUser } = useSelector((state: UserObjState) => state.user);
  const user = currentUser?.user;

  const { loadEntirePost } = useEntirePost();
  const [friendSendRequest, { loading: followLoading }] =
    useMutation(FOLLOW_FRIEND);

  const [posts, setPosts] = useState<postObj[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const [likedIds, setLikedIds] = useState<Set<string>>(() => new Set());
  const [requestedIds, setRequestedIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(
    null,
  );

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  const fetchPosts = useCallback(
    async (cursor?: string | null) => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setIsLoading(true);

      try {
        const { data } = await loadEntirePost({
          variables: { lastPostId: cursor ?? null },
        });

        const result = data?.fetchMePosts;
        const fetchedPosts = result?.posts ?? [];

        setPosts((previous) =>
          cursor ? [...previous, ...fetchedPosts] : fetchedPosts,
        );
        setNextCursor(result?.nextCursor ?? null);
        setHasInitialized(true);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load posts.";
        toast.error(message);
        setHasInitialized(true);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [loadEntirePost],
  );

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (!hasInitialized || nextCursor === null) return;

    const target = bottomRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoadingRef.current) {
          void fetchPosts(nextCursor);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasInitialized, nextCursor, fetchPosts]);

  const handleFollowRequest = useCallback(
    async (authorId: string) => {
      if (!authorId || followLoading) return;

      try {
        const { data } = await friendSendRequest({
          variables: { receiverId: authorId },
        });

        const result = data?.friendSendRequest;

        if (result?.response) {
          toast.success(result.message || "Follow request sent.");
          setRequestedIds((previous) => {
            const next = new Set(previous);
            next.add(authorId);
            return next;
          });
        } else if (result?.message) {
          toast.error(result.message);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to send request.";
        toast.error(message);
      }
    },
    [friendSendRequest, followLoading],
  );

  const toggleLike = useCallback((postId: string) => {
    setLikedIds((previous) => {
      const next = new Set(previous);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  }, []);

  const toggleComments = useCallback((postId: string) => {
    setOpenCommentPostId((current) =>
      current === postId ? null : postId,
    );
  }, []);

  return (
    <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 pb-10 pt-24 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <button
          type="button"
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
              {user?.name ?? "Your profile"}
            </h2>
            <p className="text-sm text-slate-500">
              @{user?.name?.split(" ")[0]?.toLowerCase() ?? "user"}
            </p>
            <p className="mt-3 text-xs text-slate-500">
              View your profile, posts and connections.
            </p>
          </div>
        </button>
      </aside>

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
          posts.map((post, index) => {
            // The feed card uses this subset of the post query result.
            // Keep the cast at this boundary if postObj has additional fields.
            const feedPost = post as unknown as FeedPost;
            const authorId = feedPost.author?.id;
            const isMine = Boolean(authorId && authorId === user?.id);

            const followState: FollowState = isMine
              ? "none"
              : feedPost.author?.isFollowing
                ? "following"
                : authorId && requestedIds.has(authorId)
                  ? "requested"
                  : "none";

            return (
              <PostCard
                key={feedPost.id}
                post={feedPost}
                index={index}
                currentUserId={user?.id}
                followState={followState}
                followPending={followLoading}
                onFollow={handleFollowRequest}
                liked={likedIds.has(feedPost.id)}
                onToggleLike={() => toggleLike(feedPost.id)}
                commentsOpen={openCommentPostId === feedPost.id}
                onToggleComments={() => toggleComments(feedPost.id)}
              />
            );
          })
        ) : (
          <p className="py-10 text-center text-sm text-slate-500">
            No posts yet. Be the first to share something.
          </p>
        )}

        <div ref={bottomRef} aria-hidden="true" />

        {isLoading && posts.length > 0 && (
          <div className="py-3">
            <PostSkeleton />
          </div>
        )}
      </section>
    </main>
  );
}

export default HomeComponent;
