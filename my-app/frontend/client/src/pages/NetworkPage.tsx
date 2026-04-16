import ManageMyNetworkComponent from "../components/Network/ManageMyNetworkComponent";
import InvitationComponent from "../components/Network/InvitationComponent";
import RecommendedFriend from "../components/helperComponent/RecommendedFriend";

function NetworkPage() {
  return (
    <div className="w-full flex justify-center h-full">
      <div className="flex flex-col justify-center items-center bg-white h-full p-5! rounded-xl gap-5!">
        {/* Invitation */}
        <InvitationComponent />
        <ManageMyNetworkComponent />
        <RecommendedFriend />
      </div>
    </div>
  );
}

export default NetworkPage;
