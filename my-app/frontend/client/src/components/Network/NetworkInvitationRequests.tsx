import { Link } from "react-router-dom";
import RequestCard from "../helperComponent/Card/RequestCard";
import { useState, type ComponentType } from "react";

const RequestCardComponent = RequestCard as unknown as ComponentType<{
  isReceivedActive?: boolean;
}>;

function NetworkInvitationRequests() {
  const [isReceivedActive, setIsReceivedActive] = useState(true);
  const [isSentActive, setIsSentActive] = useState(false);
  return (
    <div className="w-full h-full flex flex-col border rounded p-5! bg-white">
      <div className="w-full h-full justify-center items-center flex flex-col gap-5">
        <div className="flex w-full gap-5 border p-4! rounded items-center bg-[#f0ffff] h-20">
          <div
            onClick={() => {
              setIsReceivedActive(true);
              setIsSentActive(false);
            }}
            className={`w-35 px-6! py-2! flex justify-center items-center self-center rounded hover:bg-green-200 hover:text-black cursor-pointer  h-full ${isReceivedActive ? "bg-green-300" : ""}`}
          >
            <h3 className="w-full flex justify-center items-center">
              <Link
                to={"/network/invitation/requests"}
                className={`w-full h-full flex justify-center items-center `}
              >
                Received
              </Link>
            </h3>
          </div>

          <span>|</span>
          <div
            className={`w-35 rounded px-6! py-2! flex justify-center items-center self-center hover:bg-green-200 hover:text-black cursor-pointer ${isSentActive ? "bg-green-300" : ""}`}
            onClick={() => {
              setIsSentActive(true);
              setIsReceivedActive(false);
            }}
          >
            <h3 className="w-full flex justify-center items-center">
              <Link to={"/network/invitation/requests"} className={``}>
                Sent
              </Link>
            </h3>
          </div>
        </div>
        <div className="w-full h-170 bg-[#f0ffff] border px-5! rounded relative flex flex-col items-center overflow-y-scroll">
          <div className="absolute  w-full flex-col gap-5 flex justify-center items-center p-5!">
            <RequestCardComponent isReceivedActive={isReceivedActive} />
            <RequestCardComponent />
            <RequestCardComponent />
            <RequestCardComponent />
            <RequestCardComponent />
            <RequestCardComponent />
            <RequestCardComponent />
            <RequestCardComponent />
            <RequestCardComponent />
            <RequestCardComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NetworkInvitationRequests;
