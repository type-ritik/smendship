import {
  // useDispatch
  useSelector,
} from "react-redux";
import type { UserObjState } from "../utils/userInterfaces";
import {
  // useEffect
  useState,
} from "react";
// import { useMutation } from "@apollo/client";
// import { ALTER_PROFILE_DATA } from "../services/AuthService";
// import toast from "react-hot-toast";
import { FiEdit } from "react-icons/fi";
import EditProfile from "../components/helperComponent/Card/EditProfile";

const CURRENT_STATE = {
  MY_POST: "MY_POST",
  LIKED_POST: "LIKED_POST",
  COMMENT_POST: "COMMENT_POST",
} as const;

type CurrentState = (typeof CURRENT_STATE)[keyof typeof CURRENT_STATE];

function ProfilePage() {
  const [isAlterProfileEnable, setIsAlterProfileEnable] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<CurrentState>(
    CURRENT_STATE.MY_POST,
  );

  const countTo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  const { currentUser } = useSelector((state: UserObjState) => state.user);
  // const [updateProfile, { data, loading, error }] =
  //   useMutation(ALTER_PROFILE_DATA);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (error) {
  //     toast.error("Something went wrong");
  //   }

  //   if (loading) {
  //     toast.loading("Updating profile...");
  //   }

  //   if (data) {
  //     toast.success("Profile updated successfully");
  //     dispatch({
  //       type: "UPDATE_USER",
  //       payload: {
  //         user: data.updateProfile,
  //       },
  //     });
  //   }
  // }, [data, loading, error, dispatch]);

  // const handleProfileAltering = async (
  //   e: React.MouseEvent<HTMLButtonElement>,
  // ) => {
  //   e.preventDefault();
  //   const variable = {
  //     name: "",
  //     email: "",
  //     password: "",
  //   };

  //   await updateProfile({
  //     variables: {
  //       input: variable,
  //     },
  //   });
  // };

  return (
    <>
      <div
        className={`w-full relative h-screen flex justify-center items-center`}
      >
        <div className="flex w-150 gap-5 not-md:w-100 flex-col absolute bottom-0 shadow-xs shadow-black rounded h-[90%] p-5! ">
          <div
            id="top"
            className="w-full rounded shadow shadow-black p-5! h-30 flex relative justify-evenly items-center"
          >
            <div className="absolute top-0 right-0 w-6 h-6 bg-white rounded flex justify-center items-center cursor-pointer">
              <FiEdit
                className=""
                onClick={() => setIsAlterProfileEnable(true)}
              />
            </div>
            <div className="head flex w-full h-full items-center justify-between">
              <div className="w-20 h-20 justify-start flex rounded-full overflow-hidden shadow-xs  shadow-black cursor-pointer">
                <img
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  alt="profile"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="detail w-3/5 justify-center flex flex-col gap-2 h-full">
                <div className="name flex-1 w-full h-1/4 px-5! flex items-center  bg-white ">
                  <h1>{currentUser?.user.name}</h1>
                </div>
                <div className="bio flex-1 w-full h-2/4 bg-white  flex items-center px-5!">
                  <p>{currentUser?.user.email}</p>
                </div>
              </div>
            </div>
            <div className="tail flex flex-col justify-between gap-5 w-2/5 ">
              <div className="w-full flex justify-start items-center px-5!">
                <h1>
                  Follower: <span className="text-blue-600">80</span>
                </h1>
              </div>
              <div className="w-full flex justify-start items-center px-5!">
                <h1>
                  Following: <span className="text-blue-600">100</span>
                </h1>
              </div>
            </div>
          </div>
          <div
            id="bottom"
            className="w-full shadow-xs relative shadow-black rounded p-5! h-full gap-5! flex flex-col"
          >
            {isAlterProfileEnable && (
              <EditProfile
                isAlterProfileEnable={isAlterProfileEnable}
                setIsAlterProfileEnable={setIsAlterProfileEnable}
              />
            )}
            <div className="w-full bg-white p-2! border rounded flex">
              <select
                name="postit"
                id="postit"
                className="flex-1 cursor-pointer rounded"
                onChange={(e) =>
                  setCurrentComponent(e.target.value as CurrentState)
                }
              >
                <option value={CURRENT_STATE.MY_POST}>My Posts</option>
                <option value={CURRENT_STATE.LIKED_POST}>Liked Posts</option>
                <option value={CURRENT_STATE.COMMENT_POST}>
                  Comment Posts
                </option>
              </select>
            </div>
            <div className="shadow-xs shadow-black h-1 w-full rounded-full"></div>
            <div className=" w-full flex justify-center items-center relative h-full overflow-y-scroll">
              <div className="gap-3 w-full flex flex-col absolute top-0">
                {currentComponent === "MY_POST"
                  ? countTo.map((item) => (
                      <div
                        key={item}
                        className="w-full h-full border rounded p-5! bg-white shadow-xs shadow-black gap-2 flex flex-col"
                      >
                        <div className="w-full flex flex-col border-b">
                          <h1 className="font-semibold text-base">
                            Lorem ipsum dolar ist consectetur elit.
                          </h1>
                          <span className="text-[10px]">
                            Posted on:{" "}
                            <span className="text-blue-600">12/12/2023</span>
                          </span>
                        </div>
                        <p className="font-normal text-sm">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Quis voluptatibus, quod, quia, quos voluptates
                          quibusdam voluptatum quidem quas quibusdam? Quisquam,
                          quae. Quisquam, Lorem ipsum dolor sit amet consectetur
                          adipisicing elit. Quis voluptatibus, quod, quia, quos
                          voluptates quibusdam voluptatum quidem quas quibusdam?
                          Quisquam, quae. Quisquam,
                        </p>
                        <div className="w-full flex justify-between border-t pt-1!">
                          <p>
                            Likes: <span>20</span>
                          </p>
                          <p>
                            Comments: <span>30</span>
                          </p>
                        </div>
                      </div>
                    ))
                  : currentComponent === "LIKED_POST"
                    ? countTo.map((item) => (
                        <div
                          key={item}
                          className="w-full h-full border rounded p-5! bg-white shadow-xs shadow-black gap-2 flex flex-col"
                        >
                          <div className="w-full h-full flex border-b justify-evenly items-center py-1!">
                            <div className="w-1/9 h-full flex justify-start items-center">
                              <div className="w-10 h-10 justify-start flex rounded-full overflow-hidden shadow-xs  shadow-black cursor-pointer">
                                <img
                                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                  alt="profile"
                                  className="w-full h-full object-cover object-center"
                                />
                              </div>
                            </div>
                            <div className="w-7/9 flex flex-col  overflow-x-hidden">
                              <h1 className="font-semibold text-base cursor-pointer">
                                Lorem ipsum dolar ist consectetur elit.
                              </h1>
                              <span className="text-[10px]">
                                Posted by:{" "}
                                <span className="text-blue-600 cursor-pointer">
                                  Milo kibo
                                </span>
                              </span>
                            </div>
                            <div className="w-1/9 flex justify-end">
                              <span className="text-blue-600 font-semibold text-sm cursor-pointer">
                                Follow
                              </span>
                            </div>
                          </div>
                          <div className="w-full flex justify-between">
                            <p className="text-blue-400 cursor-pointer">
                              Likes: <span>20</span>
                            </p>
                            <span className="text-[10px] flex justify-end text-gray-500 gap-1 font-semibold">
                              -{""}
                              <span>12 July 2023</span>
                            </span>
                          </div>
                        </div>
                      ))
                    : countTo.map((item) => (
                        <div
                          key={item}
                          className="w-full h-full border rounded p-5! bg-white shadow-xs shadow-black gap-2 flex flex-col"
                        >
                          <div className="w-full h-full flex border-b justify-evenly items-center py-1!">
                            <div className="w-1/9 h-full flex justify-start items-center">
                              <div className="w-10 h-10 justify-start flex rounded-full overflow-hidden shadow-xs  shadow-black cursor-pointer">
                                <img
                                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                  alt="profile"
                                  className="w-full h-full object-cover object-center"
                                />
                              </div>
                            </div>
                            <div className="w-7/9 flex flex-col  overflow-x-hidden">
                              <h1 className="font-semibold text-base cursor-pointer">
                                Lorem ipsum dolar ist consectetur elit.
                              </h1>
                              <span className="text-[10px]">
                                Posted by:{" "}
                                <span className="text-blue-600 cursor-pointer">
                                  Milo kibo
                                </span>
                              </span>
                            </div>
                            <div className="w-1/9 flex justify-end">
                              <span className="text-blue-600 font-semibold text-sm cursor-pointer">
                                Follow
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="font-normal text-sm">
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit. Quis voluptatibus, quod, quia, quos
                              voluptates quibusdam
                            </p>
                            <span className="text-[9px] flex w-full justify-end text-gray-500 gap-1 font-semibold">
                              -{""}
                              <span>12 July 2023</span>
                            </span>
                          </div>
                          <div className="w-full flex justify-between border-t  pt-1!">
                            <p>
                              Likes: <span>20</span>
                            </p>
                            <p>
                              Views: <span>50</span>
                            </p>
                          </div>
                        </div>
                      ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
