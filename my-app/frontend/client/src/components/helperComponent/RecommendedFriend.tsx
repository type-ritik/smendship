import RecommendCardComponent from "./Card/RecommendCardComponent";

function RecommendedFriend() {
  const num: number = 10;
  return (
    <>
      <div
        className="recommend-friend w-full flex flex-col
        border p-5! rounded"
      >
        <div className="w-full justify-center flex flex-col gap-5!">
          <div className="w-full flex items-center justify-start border p-5! rounded">
            <h2 className="text-lg font-medium">Recommend Friend</h2>
          </div>
          <div className="w-full flex justify-center items-center flex-col gap-5!">
            <div className="w-full flex h-full gap-5! flex-wrap items-center justify-center">
              {Array.from({ length: num }).map((_, index) => (
                <RecommendCardComponent key={index} />
              ))}
            </div>
            <div className="w-full flex justify-end text-blue-600 hover:text-blue-900 cursor-pointer">
              see more...
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecommendedFriend;
