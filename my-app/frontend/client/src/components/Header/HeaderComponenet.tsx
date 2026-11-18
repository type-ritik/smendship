import { Link, NavLink } from "react-router-dom";
import { useFetchFriends } from "../../services/FriendService";
import { useEffect, useRef, useState } from "react";
import FriendCanva from "../Friends/FriendCanva";
import type { InvitationRequestInterface } from "../../utils/userInterfaces";
import {
  FiBell,
  FiHome,
  FiMessageCircle,
  FiSearch,
  FiUser,
  FiUsers,
} from "react-icons/fi";

const NAV_LINKS = [
  { name: "Home", route: "/", icon: FiHome },
  { name: "Connection", route: "/network", icon: FiUsers },
  { name: "Chat", route: "/chatroom/user/list", icon: FiMessageCircle },
  { name: "Notification", route: "/notification", icon: FiBell },
  { name: "Profile", route: "/profile", icon: FiUser },
];

function HeaderComponenet() {
  const [searchFriend, setSearchFriend] = useState("");
  const [showFriends, setShowFriends] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const { loading, loadFriend, error, data } = useFetchFriends();

  const query = searchFriend.trim();
  const searchOutput: InvitationRequestInterface["sender"][] =
    query && data ? data.searchUser : [];

  // Debounced search. The old code searched with the previous keystroke's
  // value (state hadn't updated yet) and fired a request on every key.
  useEffect(() => {
    if (!query) {
      setShowFriends(false);
      return;
    }
    setShowFriends(true);
    const timer = setTimeout(() => {
      loadFriend({ variables: { name: query } });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, loadFriend]);

  useEffect(() => {
    if (error) console.error("Error fetching friends:", error);
  }, [error]);

  // Close results on outside click or Escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setShowFriends(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowFriends(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const name = "Facebook";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-teal-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link
            to="/"
            className="text-xl font-bold text-teal-700 transition hover:scale-105 sm:text-2xl"
          >
            {name}
          </Link>

          <div ref={boxRef} className="relative min-w-0 max-w-md flex-1">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="search"
              id="search"
              value={searchFriend}
              onChange={(e) => setSearchFriend(e.target.value)}
              onFocus={() => query && setShowFriends(true)}
              placeholder="Search people"
              autoComplete="off"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
            {showFriends && (
              <FriendCanva friendsList={searchOutput} loading={loading} />
            )}
          </div>

          {/* Desktop navigation */}
          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ name, route, icon: Icon }) => (
              <NavLink
                key={route}
                to={route}
                end={route === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-teal-100 text-teal-800"
                      : "text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                  }`
                }
              >
                <Icon />
                {name}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-teal-100 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {NAV_LINKS.map(({ name, route, icon: Icon }) => (
          <NavLink
            key={route}
            to={route}
            end={route === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 text-[11px] transition active:scale-95 ${
                isActive ? "text-teal-700" : "text-slate-500"
              }`
            }
          >
            <Icon size={20} />
            {name === "Notification" ? "Alerts" : name}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export default HeaderComponenet;
