import type { CSSProperties } from "react";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import ShowComments from "../Comment/ShowComments";
import {
  ExpandableText,
  ImageCarousel,
  type PostImageItem,
} from "./PostMedia";

const AVATAR =
  "https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export interface FeedPost {
  id: string;
  title?: string | null;
  content: string;
  createdAt: Date | string | number;
  postImages?: Array<PostImageItem | string> | null;
  author?: {
    id: string;
    name: string;
    isFollowing?: boolean | null;
  } | null;
}

export type FollowState = "following" | "requested" | "none";

function formatPostTime(time: Date | string | number): string {
  const now = new Date();
  const posted = new Date(time);
  const difference = now.getTime() - posted.getTime();
  if (Number.isNaN(difference) || difference < 0) return "Just now";

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days < 1) {
    if (hours > 0) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }
    return seconds <= 5 ? "Just now" : `${seconds} seconds ago`;
  }
  if (days <= 7) return `${days} ${days === 1 ? "day" : "days"} ago`;

  return posted.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(posted.getFullYear() !== now.getFullYear() && { year: "numeric" }),
  });
}

interface PostCardProps {
  post: FeedPost;
  index: number;
  currentUserId?: string;
  followState: FollowState;
  followPending: boolean;
  onFollow: (authorId: string) => void;
  liked: boolean;
  onToggleLike: () => void;
  commentsOpen: boolean;
  onToggleComments: () => void;
}

export default function PostCard({
  post,
  index,
  currentUserId,
  followState,
  followPending,
  onFollow,
  liked,
  onToggleLike,
  commentsOpen,
  onToggleComments,
}: PostCardProps) {
  const authorId = post.author?.id;
  const isMine = Boolean(authorId && authorId === currentUserId);

  return (
    <article
      className="anim-rise rounded-2xl border border-teal-100 bg-white shadow-sm"
      style={{ "--i": Math.min(index, 6) + 2 } as CSSProperties}
    >
      <header className="flex items-center gap-3 p-4 sm:px-5">
        <img
          src={AVATAR}
          alt=""
          className="h-11 w-11 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {post.author?.name ?? "Unknown user"}
          </p>
          <p className="flex gap-2 text-xs text-slate-500">
            <span className="font-semibold">
              {formatPostTime(post.createdAt)}
            </span>
            <span>Public</span>
          </p>
        </div>

        {!isMine && authorId && (
          <>
            {followState === "following" && (
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                Following
              </span>
            )}
            {followState === "requested" && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                Requested
              </span>
            )}
            {followState === "none" && (
              <button
                type="button"
                onClick={() => onFollow(authorId)}
                disabled={followPending}
                className="rounded-full border border-teal-600 px-4 py-1.5 text-sm font-medium text-teal-700 transition hover:bg-teal-600 hover:text-white active:scale-95 disabled:opacity-60"
              >
                {followPending ? "Sending…" : "Follow"}
              </button>
            )}
          </>
        )}
      </header>

      <div className="border-t border-teal-50 px-4 py-4 sm:px-5">
        {post.title && (
          <h3 className="mb-1 text-base font-semibold text-slate-900">
            {post.title}
          </h3>
        )}
        <ExpandableText
          text={post.content}
          className="text-[15px] leading-relaxed text-slate-800"
        />
        <ImageCarousel images={post.postImages} />
      </div>

      <footer className="flex border-t border-teal-50 px-2 py-1">
        <button
          type="button"
          onClick={onToggleLike}
          aria-pressed={liked}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition hover:bg-teal-50 active:scale-95 ${
            liked ? "text-rose-600" : "text-slate-600"
          }`}
        >
          <FiHeart
            className={`transition-transform ${liked ? "scale-125 fill-current" : ""}`}
          />
          Like
        </button>
        <button
          type="button"
          onClick={onToggleComments}
          aria-expanded={commentsOpen}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-slate-600 transition hover:bg-teal-50 active:scale-95"
        >
          <FiMessageCircle />
          Comment
        </button>
      </footer>

      {commentsOpen && (
        <div className="anim-pop border-t border-teal-50 px-4 pb-4 sm:px-5">
          <ShowComments />
        </div>
      )}
    </article>
  );
}
