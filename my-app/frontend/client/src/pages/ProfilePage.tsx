import { useSelector } from "react-redux";
import type { UserObjState } from "../utils/userInterfaces";

function ProfilePage() {
  const { currentUser } = useSelector((state: UserObjState) => state.user);

  return (
    <>
      <div className="mt-30! flex flex-col w-full items-center h-full border rounded p-5! bg-white gap-5 shadow-xs shadow-black">
        <div className="w-full h-20 border bg-[#f0ffff] justify-center items-center flex rounded shadow-xs shadow-black">
          <h1 className="font-normal">Profile Page</h1>
        </div>
        <div className="w-full h-full border rounded justify-center flex flex-col gap-5 p-5! bg-[#f0ffff] items-center shadow-xs shadow-black">
          <div className="w-[90%] md:w-[40%] bg-white border p-5! rounded h-[57%] shadow-xs shadow-blue-950">
            <form
              action=""
              className="w-full flex flex-col justify-evenly h-full"
            >
              <div className="border rounded p-3! bg-[#f0ffff] shadow-xs shadow-blue-950">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={currentUser?.user.name}
                  disabled
                  className="border rounded outline-none  p-3! w-full bg-white"
                />
              </div>
              <div className="border rounded p-3! bg-[#f0ffff] shadow-xs shadow-blue-950">
                <label htmlFor="name">Email</label>
                <input
                  type="text"
                  id="name"
                  value={currentUser?.user.email}
                  disabled
                  className="border rounded p-3! w-full bg-white outline-none "
                />
              </div>
              <div className="border rounded p-3! bg-[#f0ffff] shadow-xs shadow-blue-950">
                <label htmlFor="name">Password</label>
                <input
                  type="text"
                  id="name"
                  value="********"
                  disabled
                  className="border rounded outline-none p-3! w-full bg-white"
                />
              </div>
            </form>
          </div>
          <div className="w-[90%] md:w-[40%] flex flex-col">
            <div className="flex justify-center items-center w-full">
              <button className="flex-1 w-full flex justify-center items-center bg-[#bedbff]! shadow-sm shadow-blue-950">
                <h1 className="text-black">Edit Profile</h1>
              </button>
            </div>
            <div>
              <button className="flex-1 w-full flex justify-center items-center bg-[#ffbdbd]! shadow-sm shadow-red-950 mt-5!">
                <h1 className="text-black">Delete Account</h1>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
