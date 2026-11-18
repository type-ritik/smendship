import { IoMdArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";

function ManageMyNetworkComponent() {
  return (
    <Link
      to="/network/manage/follower"
      className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-teal-600 sm:p-6"
    >
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-slate-900">
          Manage my network
        </h2>
        <p className="text-sm text-slate-500">
          See your followers and the people you follow.
        </p>
      </div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 transition group-hover:bg-teal-600 group-hover:text-white">
        <IoMdArrowRoundForward className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export default ManageMyNetworkComponent;
