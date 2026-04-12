import React from "react";
import { Link, useNavigate } from "react-router-dom";

function NetworkPage() {
  const navigate = useNavigate();
  const id: number = 1;
  return (
    <div className="w-full flex justify-center h-full">
      <div className="flex flex-col justify-center items-center bg-white h-full p-5! rounded-xl">
        <h1 className="text-2xl font-bold">Network Page</h1>
        <div className="invitation">
          <div className="flex items-center gap-2 w-250 h-30 border border-gray-400 rounded-sm p-5! hover:shadow shadow-2xs shadow-black">
            <div
              className="w-20 cursor-pointer"
              onClick={() => {
                navigate(`/network/invitaion/${id}`);
              }}
            >
              <div className="w-16 h-16 overflow-hidden rounded-full">
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
                navigate(`/network/invitaion/${id}`);
              }}
            >
              <h3 className="text-xl font-semibold text-gray-800">
                Ritik Sharma
              </h3>
              <p className="text-sm text-gray-600">Software Engineer</p>
              <span className="time">
                <span className="text-gray-500">2h</span> &#8226;{" "}
              </span>
            </div>
            <div className="flex gap-5 w-1/2 justify-end-safe">
              <button className="border py-3! px-6! bg-gray-200! text-red-700!  rounded justify-center flex flex-1 text-sm font-medium uppercase">
                Reject
              </button>
              <button className="border py-3! px-6! rounded bg-gray-200! text-green-700! justify-center flex flex-1 text-sm font-medium uppercase">
                Accept
              </button>
            </div>
          </div>
        </div>
        <div className="manage-network">
          <Link to={"/network/manage"}>
            <h2 className="text-lg font-semibold">Manage Network</h2>
          </Link>
        </div>
        <div className="recommend-friend">
          <Link to={"/network/recommend"}>
            <h2 className="text-lg font-semibold">Recommend Friend</h2>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NetworkPage;
