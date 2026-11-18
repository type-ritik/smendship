import { useState } from "react";
import { MdCancel } from "react-icons/md";

const IMAGE =
  "https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// Name/role default to the old placeholder until real data is passed in.
function RecommendCardComponent({
  name = "John Doe",
  role = "Software Engineer",
  onConnect,
}: {
  name?: string;
  role?: string;
  onConnect?: () => void;
}) {
  const [dismissed, setDismissed] = useState(false);
  const [requested, setRequested] = useState(false);

  if (dismissed) return null;

  return (
    <article className="anim-pop flex flex-col overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-16">
        <img src={IMAGE} alt="" className="h-full w-full object-cover" />
        <button
          onClick={() => setDismissed(true)}
          aria-label={`Dismiss ${name}`}
          className="absolute right-2 top-2 text-white/90 transition hover:scale-110 hover:text-white"
        >
          <MdCancel size={20} />
        </button>
        <img
          src={IMAGE}
          alt=""
          className="absolute -bottom-7 left-1/2 h-14 w-14 -translate-x-1/2 rounded-full border-2 border-white object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col items-center gap-3 px-4 pb-4 pt-9 text-center">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {name}
          </h3>
          <p className="truncate text-sm text-slate-500">{role}</p>
        </div>
        <button
          onClick={() => {
            setRequested(true);
            onConnect?.();
          }}
          disabled={requested}
          className="mt-auto w-full rounded-full border border-teal-600 py-1.5 text-sm font-medium text-teal-700 transition hover:bg-teal-600 hover:text-white active:scale-95 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
        >
          {requested ? "Requested" : "Connect"}
        </button>
      </div>
    </article>
  );
}

export default RecommendCardComponent;
