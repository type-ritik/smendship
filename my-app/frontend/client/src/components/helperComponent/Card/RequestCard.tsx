import type { InvitationRequestInterface } from "../../../utils/userInterfaces";

type RequestCardProps = {
  isReceivedActive: number | boolean;
  invitationRequest: InvitationRequestInterface[] | [];
};

function RequestCard({
  isReceivedActive,
  invitationRequest,
}: RequestCardProps) {
  const request = invitationRequest;

  return (
    <>
      <div className="w-full flex flex-col gap-3 justify-center items-center">
        {request === undefined ? (
          <div className="text-center text-gray-500">
            No{" "}
            {isReceivedActive === true
              ? "received invitation"
              : isReceivedActive === false
                ? "sent invitation"
                : isReceivedActive === 2
                  ? "follower friends"
                  : "following friends"}{" "}
            yet.
          </div>
        ) : (
          request.map((item) => (
            <div
              key={item.id}
              className="flex justify-center  bg-sky-200
          items-center gap-2 w-full h-25 border border-gray-400 rounded-sm p-5! hover:shadow shadow-2xs shadow-black not-md:w-150"
            >
              <div className="w-20 cursor-pointer">
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
              <div className="flex flex-col w-1/2 cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.user.name}
                </h3>
                <p className="text-[14px] text-gray-600">{item.user.id}</p>
                <span className="time text-[12px]">
                  <span className="text-gray-500">{item.createdAt}</span>{" "}
                  &#8226;{" "}
                </span>
              </div>
              <div className="flex gap-5 w-1/2 justify-end-safe">
                {isReceivedActive ? (
                  <div className="flex gap-5 w-full justify-end-safe">
                    <button
                      className="border py-3! px-6! bg-gray-200! text-red-700!  rounded justify-center flex flex-1 text-sm font-medium uppercase hover:bg-red-700! hover:text-gray-200!
              transition-colors
              shadow-sm hover:shadow-black shadow-red-700
              "
                    >
                      {isReceivedActive === true
                        ? "Reject"
                        : isReceivedActive === 2
                          ? "Revoked"
                          : "Unfollow"}
                    </button>
                    <button
                      className="border py-3! px-6! rounded bg-gray-200! text-green-700! justify-center flex flex-1 text-sm font-medium upp`ercase
              hover:bg-green-700! hover:text-gray-200!
              transition-colors
              shadow-sm hover:shadow-black shadow-green-700
              "
                    >
                      {isReceivedActive === true ? "Accept" : "Chat"}
                    </button>
                  </div>
                ) : (
                  <div className="flex w-1/2">
                    <button
                      className="border py-3! px-6! bg-gray-200! text-red-700!  rounded justify-center flex flex-1 text-sm font-medium uppercase hover:bg-red-700! hover:text-gray-200!
              transition-colors
              shadow-sm hover:shadow-black shadow-red-700
              "
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default RequestCard;
