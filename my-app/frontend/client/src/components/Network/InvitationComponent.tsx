import { useNavigate } from "react-router-dom";
import RequestCard from "../helperComponent/Card/RequestCard";
import type { InvitationRequestInterface } from "../../utils/userInterfaces";
import type { ComponentType } from "react";

const RequestCardComponent = RequestCard as unknown as ComponentType<{
  isReceivedActive: number | boolean;
  invitationRequest: InvitationRequestInterface[];
}>;

type InvitationComponentProps = {
  listOfReceivedFriendRequest: InvitationRequestInterface[];
};

function InvitationComponent({
  listOfReceivedFriendRequest,
}: InvitationComponentProps) {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full flex flex-col gap-5! border p-5!">
        <div className="p-5! border rounded">
          <h2 className="text-xl font-medium">Invitation</h2>
        </div>
        <RequestCardComponent
          isReceivedActive={true}
          invitationRequest={listOfReceivedFriendRequest}
        />
        <div>
          <button
            className="border py-3! px-6! bg-gray-200! text-gray-700! rounded justify-center flex text-sm font-medium uppercase hover:bg-gray-700! hover:text-gray-200!
              transition-colors
              shadow-sm hover:shadow-black shadow-gray-700
              "
            onClick={() => {
              navigate("/network/invitation/requests");
            }}
          >
            See all invitations
          </button>
        </div>
      </div>
    </>
  );
}

export default InvitationComponent;
