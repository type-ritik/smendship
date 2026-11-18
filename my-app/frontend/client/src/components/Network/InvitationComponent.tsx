import { useNavigate } from "react-router-dom";
import RequestCard from "../helperComponent/Card/RequestCard";
import type { InvitationRequestInterface } from "../../utils/userInterfaces";

type InvitationComponentProps = {
  listOfReceivedFriendRequest: InvitationRequestInterface[];
};

const PREVIEW_COUNT = 3;

function InvitationComponent({
  listOfReceivedFriendRequest,
}: InvitationComponentProps) {
  const navigate = useNavigate();
  const total = listOfReceivedFriendRequest.length;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Invitations</h2>
        {total > 0 && (
          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800">
            {total}
          </span>
        )}
      </div>

      {/* The card needs responseCall (the old code passed an unused prop,
          so every invitation showed the wrong buttons). */}
      <RequestCard
        responseCall="RECEIVE"
        invitationRequest={listOfReceivedFriendRequest.slice(0, PREVIEW_COUNT)}
      />

        <button
          onClick={() => navigate("/network/invitation/requests")}
          className="self-start rounded-lg border border-teal-600 px-4 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-600 hover:text-white active:scale-95"
        >
          See all invitations
        </button>
    </div>
  );
}

export default InvitationComponent;
