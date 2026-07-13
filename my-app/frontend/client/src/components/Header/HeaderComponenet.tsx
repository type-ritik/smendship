import { Link } from "react-router-dom";
import "./Header.css";
import { useFetchFriends } from "../../services/FriendService";
import { useEffect, useState } from "react";
import FriendCanva from "../Friends/FriendCanva";
import type { InvitationRequestInterface } from "../../utils/userInterfaces";

function HeaderComponenet() {
  const [searchFriend, setSearchFriend] = useState("");
  const [showFriends, setShowFriends] = useState(false);
  const [searchOutput, setSearchOutput] = useState<
    [InvitationRequestInterface["user"]] | []
  >([]);

  const navLink = [
    { name: "Home", route: "/" },
    { name: "Connection", route: "/network" },
    { name: "Chat", route: "/chatroom/user/list" },
    { name: "Notification", route: "/notification" },
    { name: "Profile", route: "/profile" },
  ];

  const { loading, loadFriend, error, data } = useFetchFriends();

  const handleFetchFriends = async () => {
    if (searchFriend.length > 0) {
      await loadFriend({
        variables: {
          friendName: searchFriend,
        },
      });
    }
  };

  useEffect(() => {
    if (searchFriend.length < 1) {
      setSearchOutput([]);
      setShowFriends(false);
    }
  }, [searchFriend]);

  useEffect(() => {
    if (loading) {
      console.log("Loading friends...");
    }

    if (error) {
      console.error("Error fetching friends:", error);
    }

    if (data) {
      console.log("Fetched friends:", data.searchFriends);
      setSearchOutput(data.searchFriends);
    }
  }, [loading, error, data]);

  const name = "Facebook";

  return (
    <div className="w-full h-20 z-20 flex fixed justify-between bg-blue-200 top-0 left-0 shadow-xs shadow-black">
      <div className="w-2/6 flex justify-center items-center">
        <h1 className="text-3xl pr-5! pl-20! not-md:text-2xl font-bold text-blue-800">
          {name}
        </h1>
        <div className="w-full relative flex">
          <input
            type="search"
            name="search"
            id="search"
            onChange={(e) => {
              setSearchFriend(e.target.value);
              setShowFriends(true);
              handleFetchFriends();
            }}
            value={searchFriend}
            placeholder="Find here..."
            className="rounded-full! flex-1 flex text-base pl-5! bg-white!"
          />
        </div>
        {showFriends && <FriendCanva friendsList={searchOutput} />}
      </div>
      <div className="flex w-2/4 not-md:w-2/3 items-center">
        <ul className="w-full flex gap-15 uppercase font-semibold text-[14px] pr-20! not-md:text-[12px] justify-end">
          {navLink.map((item, index) => (
            <li key={index} className="hover:text-blue-500">
              <Link to={item.route} className="focus:text-white px-4! py-2!">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HeaderComponenet;
