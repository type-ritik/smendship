import { useNavigate } from "react-router-dom";

function RequestCard() {
  const navigate = useNavigate();
  const id: number = 1;
  return (
    <>
      <div className="w-full flex justify-center items-center">
        <div
          className="flex justify-center  bg-sky-200
          items-center gap-2 w-full h-25 border border-gray-400 rounded-sm p-5! hover:shadow shadow-2xs shadow-black not-md:w-150"
        >
          <div
            className="w-20 cursor-pointer"
            onClick={() => {
              navigate(`/network/invitation/received/${id}`);
            }}
          >
            <div
              className="w-14 h-14 overflow-hidden rounded-full
              border
              "
            >
              <img
                src="https://media.istockphoto.com/id/1413735503/photo/social-media-social-media-marketing-thailand-social-media-engagement-post-structure.jpg?s=2048x2048&w=is&k=20&c=i6oJR_ptHv1Yf6NeZ6ncHpS-OX04GUotOhB2Mug20n4="
                alt="Profile-Picture"
                className="w-full h-full object-cover object-center rounded"
              />
            </div>
          </div>
          <div
            className="flex flex-col w-1/2 cursor-pointer"
            onClick={() => {
              navigate(`/network/invitation/received/${id}`);
            }}
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Ritik Sharma
            </h3>
            <p className="text-[14px] text-gray-600">Software Engineer</p>
            <span className="time text-[12px]">
              <span className="text-gray-500">2h</span> &#8226;{" "}
            </span>
          </div>
          <div className="flex gap-5 w-1/2 justify-end-safe">
            <button
              className="border py-3! px-6! bg-gray-200! text-red-700!  rounded justify-center flex flex-1 text-sm font-medium uppercase hover:bg-red-700! hover:text-gray-200!
              transition-colors
              shadow-sm hover:shadow-black shadow-red-700
              "
            >
              Reject
            </button>
            <button
              className="border py-3! px-6! rounded bg-gray-200! text-green-700! justify-center flex flex-1 text-sm font-medium uppercase
              hover:bg-green-700! hover:text-gray-200!
              transition-colors
              shadow-sm hover:shadow-black shadow-green-700
              "
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestCard;
