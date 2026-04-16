import { IoMdArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";

function ManageMyNetworkComponent() {
  return (
    <>
      <div className="manage-network w-full h-15 flex border p-5! rounded">
        <Link to={"/network/manage"} className="w-full h-full">
          <div className="w-full h-full flex items-center justify-between">
            <div className="w-1/2 flex justify-starts">
              <h2 className="text-lg font-medium">Manage my network</h2>
            </div>
            <div className="w-1/2 flex justify-end">
              <IoMdArrowRoundForward />
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default ManageMyNetworkComponent;
