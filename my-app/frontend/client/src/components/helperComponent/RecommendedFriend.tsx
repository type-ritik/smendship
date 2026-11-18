import RecommendCardComponent from "./Card/RecommendCardComponent";

const PLACEHOLDER_COUNT = 8;

function RecommendedFriend() {
  return (
    <section className="flex w-full flex-col gap-4 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          People you may know
        </h2>
        <button className="text-sm font-medium text-teal-700 hover:underline">
          See more
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
          <RecommendCardComponent key={index} />
        ))}
      </div>
    </section>
  );
}

export default RecommendedFriend;
