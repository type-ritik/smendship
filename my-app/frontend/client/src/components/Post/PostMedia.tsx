import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, UIEvent } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const PREVIEW_CHARS = 220;
const PREVIEW_LINES = 5;

function makePreview(text: string, limit: number, maxLines: number) {
  let preview = text;
  let cut = false;
  const lines = preview.split("\n");
  if (lines.length > maxLines) {
    preview = lines.slice(0, maxLines).join("\n");
    cut = true;
  }
  if (preview.length > limit) {
    const head = preview.slice(0, limit);
    const lastSpace = head.lastIndexOf(" ");
    preview = lastSpace > limit * 0.6 ? head.slice(0, lastSpace) : head;
    cut = true;
  }
  return { preview: preview.trimEnd(), cut };
}

interface ExpandableTextProps {
  text?: string | null;
  className?: string;
}

export function ExpandableText({ text, className = "" }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const body = text ?? "";
  const { preview, cut } = makePreview(body, PREVIEW_CHARS, PREVIEW_LINES);

  if (!cut) {
    return (
      <p className={`whitespace-pre-wrap break-words ${className}`}>{body}</p>
    );
  }

  return (
    <p className={`whitespace-pre-wrap break-words ${className}`}>
      {expanded ? body : preview}
      {expanded ? (
        <>
          {" "}
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="font-medium text-teal-700 hover:underline"
          >
            See less
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="See the full post"
          className="font-medium text-teal-700 hover:underline"
        >
          {" "}
          … see more
        </button>
      )}
    </p>
  );
}

export interface PostImageItem {
  image: {
    id: string;
    url: string;
  };
}

interface ImageCarouselProps {
  images?: Array<PostImageItem | string> | null;
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  console.log(images)
  const list = (Array.isArray(images) ? images : [])
    .map((item, idx) => {
      if (typeof item === "string") {
        return { id: `${item}-${idx}`, url: item };
      }
      return item?.image?.url
        ? { id: item.image.id ?? `${item.image.url}-${idx}`, url: item.image.url }
        : null;
    })
    .filter((item): item is { id: string; url: string } => Boolean(item?.url));

  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    trackRef.current?.scrollTo({ left: 0 });
  }, [list.length]);

  const goTo = useCallback(
    (nextIndex: number) => {
      const element = trackRef.current;
      if (!element) return;
      const safeIndex = Math.max(0, Math.min(nextIndex, list.length - 1));
      element.scrollTo({
        left: safeIndex * element.clientWidth,
        behavior: "smooth",
      });
    },
    [list.length]
  );

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    if (element.clientWidth === 0) return;
    const nextIndex = Math.round(element.scrollLeft / element.clientWidth);
    setIndex(Math.max(0, Math.min(nextIndex, list.length - 1)));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" && index > 0) {
      goTo(index - 1);
    } else if (event.key === "ArrowRight" && index < list.length - 1) {
      goTo(index + 1);
    }
  };

  if (list.length === 0) return null;

  const many = list.length > 1;

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Post images"
      tabIndex={many ? 0 : -1}
      onKeyDown={handleKeyDown}
      className="group relative mt-3 overflow-hidden rounded-xl bg-slate-100 focus-visible:outline-2 focus-visible:outline-teal-600"
    >
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
      >
        {list.map((src, imageIndex) => (
          <div
            key={src.id}
            className="aspect-4/3 w-full shrink-0 snap-center"
          >
            <img
              src={src.url}
              alt={`Image ${imageIndex + 1} of ${list.length}`}
              loading="lazy"
              draggable={false}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {many && (
        <>
          {index > 0 && (
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow transition hover:scale-110 sm:flex"
            >
              <FiChevronLeft size={20} />
            </button>
          )}
          {index < list.length - 1 && (
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow transition hover:scale-110 sm:flex"
            >
              <FiChevronRight size={20} />
            </button>
          )}
          <span className="absolute right-3 top-3 rounded-full bg-slate-900/60 px-2.5 py-0.5 text-xs font-medium text-white">
            {index + 1}/{list.length}
          </span>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {list.map((_, imageIndex) => (
              <button
                key={imageIndex}
                type="button"
                onClick={() => goTo(imageIndex)}
                aria-label={`Go to image ${imageIndex + 1}`}
                aria-current={imageIndex === index ? true : undefined}
                className={`h-2 rounded-full transition-all ${
                  imageIndex === index ? "w-5 bg-white" : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
