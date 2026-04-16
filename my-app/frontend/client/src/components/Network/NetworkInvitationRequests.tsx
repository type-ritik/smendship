import RequestCard from "../helperComponent/Card/RequestCard";

function NetworkInvitationRequests() {
  return (
    <div className="w-full flex flex-col border rounded p-5! bg-white">
      <div className="w-full justify-center items-center flex flex-col gap-5">
        <div className="flex w-full gap-5 border p-4! rounded items-center bg-[#f0ffff]">
          <div className="bg-blue-300 w-35 px-6! py-2! flex justify-center items-center self-center rounded hover:bg-blue-900 hover:text-white cursor-pointer">
            <h3>Received</h3>
          </div>

          <span>|</span>
          <div className="bg-blue-100 w-35 rounded px-6! py-2! flex justify-center items-center self-center hover:bg-blue-400 hover:text-white cursor-pointer">
            <h3>Sent</h3>
          </div>
        </div>
        <div className="w-full h-170 bg-[#f0ffff] border px-5! rounded relative flex flex-col items-center overflow-y-scroll">
          <div className="absolute  w-full flex-col gap-5 flex justify-center items-center p-5!">
            <RequestCard />
            <RequestCard />
            <RequestCard />
            <RequestCard />
            <RequestCard />
            <RequestCard />
            <RequestCard />
            <RequestCard />
            <RequestCard />
            <RequestCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NetworkInvitationRequests;
