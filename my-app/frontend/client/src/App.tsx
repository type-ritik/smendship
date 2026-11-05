import "./App.css";
import LoginComponent from "./components/Auth/LoginComponent";
import { Navigate, Outlet, Route, Routes, useNavigate, useLocation } from "react-router-dom"; // 1. Added useLocation
import SignupComponent from "./components/Auth/SignupComponent";
import IndexPage from "./pages/IndexPage";
import ChatBoxComponent from "./components/Chat/ChatBoxComponent";
import NetworkPage from "./pages/NetworkPage";
import NetworkInvitationRequests from "./components/Network/NetworkInvitationRequests";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import type { UserObjState } from "./utils/userInterfaces";
import ManageMyNetwork from "./pages/ManageMyNetwork";
import Notification from "./pages/Notification";
import ProfilePage from "./pages/ProfilePage";
import { ChatProvider } from "./context/ChatProvider";

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // 2. Initialize location instance
  const { currentUser } = useSelector((state: UserObjState) => state.user);

  const ChatLayout = () => {
    return (
      <ChatProvider>
        <Outlet />
      </ChatProvider>
    );
  };

  useEffect(() => {
    // 3. Define explicit public authentication routes
    const publicAuthPaths = ["/auth/login", "/auth/signup"];

    // 4. Only redirect to login if there's no user AND they aren't already on a public auth page
    if (!currentUser && !publicAuthPaths.includes(location.pathname)) {
      navigate("/auth/login", { replace: true });
    }
  }, [navigate, currentUser, location.pathname]); // 5. Added location.pathname to the dependency array

  return (
    <>
      <Routes>
        <Route path="/auth/login" element={<LoginComponent />} />
        <Route path="/auth/signup" element={<SignupComponent />} />
        <Route path="/" element={<IndexPage />}>
          <Route element={<ChatLayout />}>
            <Route
              path="/chatroom/user"
              element={<Navigate to={"/chatroom/user/list"} replace />}
            />
            <Route path="/chatroom/user/:id" element={<ChatBoxComponent />} />
            <Route path="/chatroom/user/list" element={<ChatBoxComponent />} />
          </Route>

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route
            path="/network/invitation/requests"
            element={<NetworkInvitationRequests />}
          />
          <Route
            path="/network/manage"
            element={<Navigate to={"/network/manage/follower"} replace />}
          />
          <Route path="/network/manage/:tab" element={<ManageMyNetwork />} />
          <Route path="/notification" element={<Notification />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
