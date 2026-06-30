import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { UserObjState } from "../../../utils/userInterfaces";
import { IoExitOutline } from "react-icons/io5";
import { useMutation } from "@apollo/client";
import { ALTER_PROFILE_DATA } from "../../../services/AuthService";
import toast from "react-hot-toast";
import { profileUpdate } from "../../../redux/user/userSlice";
import ResetPassword from "../../Auth/ResetPassword";

function EditProfile({
  isAlterProfileEnable,
  setIsAlterProfileEnable,
}: {
  isAlterProfileEnable: boolean;
  setIsAlterProfileEnable: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [isResetpassword, setIsResetPassword] = useState(false);
  const { currentUser } = useSelector((state: UserObjState) => state.user);
  const dispatch = useDispatch();

  const [updateprofile, { data, error, loading }] =
    useMutation(ALTER_PROFILE_DATA);

  useEffect(() => {
    if (data) {
      dispatch(profileUpdate(data.updateprofile));
      console.log(data);
    }

    if (error) {
      toast.error("Error updating user data.");
    }
  }, [error, data, dispatch]);

  const handleProfileAltering = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    // Implement the logic to handle profile altering here
    e.preventDefault();

    const inputPayload: Record<string, string> = {};

    if (email.length > 7) {
      inputPayload.email = email;
    }

    if (name.length > 3) {
      inputPayload.name = name;
    }

    if (Object.keys(inputPayload).length === 0) {
      toast.error("No valid fields provided to update.");
      return;
    }

    try {
      await updateprofile({
        variables: {
          input: inputPayload,
        },
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error("Mutation execution failed: " + (error?.message || ""));
    }
  };

  return (
    <>
      {isAlterProfileEnable && (
        <>
          <div
            className={`fixed inset-0 bg-white/30 backdrop-blur-md top-0 left-0 z-10 w-full h-full flex justify-center items-center`}
          >
            <div className="w-3/4 h-[80%] md:w-1/3 absolute rounded bg-white p-5! shadow-xs shadow-black justify-evenly items-center gap-2 flex-col flex ">
              <div
                className="absolute top-0 right-0 p-2! cursor-pointer"
                onClick={() => setIsAlterProfileEnable(false)}
              >
                <IoExitOutline />
              </div>
              <div className="w-full flex justify-center items-center">
                <h1 className="w-full text-sm font-semibold flex justify-center items-center">
                  Profile Edits
                </h1>
              </div>
              <div className="w-full flex justify-between items-center">
                <div className="w-25 h-25 justify-start flex rounded-full overflow-hidden shadow-xs  shadow-black cursor-pointer">
                  <img
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    alt="profile"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div
                  className="w-1/2 flex justify-end cursor-pointer"
                  onClick={() => setIsResetPassword(true)}
                >
                  <span className="text-sm text-blue-600 cursor-pointer">
                    Click to reset to password!
                  </span>
                </div>
              </div>
              {isResetpassword && <ResetPassword setIsResetPassword={setIsResetPassword} />}
              <div className="w-full border rounded justify-between flex flex-col gap-5 p-5! bg-[#f0ffff] items-center shadow-xs shadow-black">
                <div className="bg-white p-5! rounded  w-full flex justify-evenly flex-col gap-2">
                  <div className="border rounded flex w-full p-3! bg-[#f0ffff] ">
                    <input
                      type="text"
                      id="name"
                      placeholder={currentUser?.user.name}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border rounded text-sm text-gray-700 outline-none  p-3! w-full bg-white"
                    />
                  </div>
                  <div className="border rounded w-full flex p-3! bg-[#f0ffff] ">
                    <input
                      type="email"
                      id="email"
                      placeholder={currentUser?.user.email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border rounded p-3! text-sm text-gray-700 w-full bg-white outline-none "
                    />
                  </div>

                  <div className="border rounded p-3! bg-[#f0ffff]  w-full">
                    <textarea
                      maxLength={200}
                      rows={3}
                      id="bio"
                      // placeholder={"bio"}
                      defaultValue={"Tell about yourself!"}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="border rounded p-3! min-h-20 w-full max-h-20 bg-white outline-none text-sm text-gray-700"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="w-full flex flex-col">
                  <div className="flex justify-center items-center w-full mt-5!">
                    <button
                      onClick={(e) => handleProfileAltering(e)}
                      className="flex-1 w-full flex justify-center items-center bg-[#bdf7bd]! shadow-sm shadow-green-950 focus:bg-green-400!"
                      disabled={loading}
                    >
                      <h1 className="text-black text-sm">
                        {" "}
                        {loading ? "Saving..." : "Save Profile"}
                      </h1>
                    </button>
                  </div>

                  <div>
                    <button className="flex-1 w-full flex justify-center items-center bg-[#ffbdbd]! shadow-sm shadow-red-950 mt-5!">
                      <h1 className="text-black text-sm">Delete Account</h1>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default EditProfile;
