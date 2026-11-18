import CommentComponent from "./CommentComponent";

const AVATAR =
  "https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// Placeholder comments; replace with real data when the query exists.
const PLACEHOLDER_COMMENTS = [1, 2, 3];

function ShowComments() {
  return (
    <section className="flex w-full flex-col gap-5 pt-5">
      <CommentComponent />

      <div className="flex flex-col gap-4">
        <h3 className="border-b border-slate-200 pb-2 text-sm font-semibold text-slate-700">
          Most recent
        </h3>

        <ul className="flex flex-col gap-5">
          {PLACEHOLDER_COMMENTS.map((item, i) => (
            <li
              key={item}
              className="anim-rise flex gap-3"
              style={{ "--i": i } as React.CSSProperties}
            >
              <img
                src={AVATAR}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-slate-900">
                      Kiriton Micky
                    </h4>
                    <p className="truncate text-xs text-slate-500">
                      Self-taught developer
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-xs">
                    <span className="text-slate-400">2h</span>
                    <button className="font-semibold text-teal-700 hover:underline">
                      Follow
                    </button>
                  </div>
                </div>
                <p className="mt-2 rounded-2xl rounded-tl-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  Lorem ipsum is scrambled placeholder text used in design to
                  show how a layout or font looks without real words
                  distracting the reader.
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ShowComments;
