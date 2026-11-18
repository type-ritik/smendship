import "./App.css";
import LoginComponent from "./components/Auth/LoginComponent";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import SignupComponent from "./components/Auth/SignupComponent";
import IndexPage from "./pages/IndexPage";
import ChatBoxComponent from "./components/Chat/ChatBoxComponent";
import NetworkPage from "./pages/NetworkPage";
import NetworkInvitationRequests from "./components/Network/NetworkInvitationRequests";
import { useSelector } from "react-redux";
import type { UserObjState } from "./utils/userInterfaces";
import ManageMyNetwork from "./pages/ManageMyNetwork";
// Renamed: `Notification` shadowed the browser's global Notification API.
import NotificationPage from "./pages/Notification";
import ProfilePage from "./pages/ProfilePage";
import { ChatProvider } from "./context/ChatProvider";
import ResetPassword from "./components/Auth/ResetPassword";

// Module level so ChatProvider isn't remounted on every App render.
function ChatLayout() {
  return (
    <ChatProvider>
      <Outlet />
    </ChatProvider>
  );
}

// Logged-out users are sent to login, remembering where they were headed.
function RequireAuth() {
  const { currentUser } = useSelector((state: UserObjState) => state.user);
  const location = useLocation();
  return currentUser ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" replace state={{ from: location }} />
  );
}

// Logged-in users shouldn't see the login / signup screens.
// After login, navigate to `location.state?.from` (if set) instead of "/".
function RedirectIfAuthed() {
  const { currentUser } = useSelector((state: UserObjState) => state.user);
  return currentUser ? <Navigate to="/" replace /> : <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route element={<RedirectIfAuthed />}>
        <Route path="/auth/login" element={<LoginComponent />} />
        <Route path="/auth/signup" element={<SignupComponent />} />
      </Route>
      <Route path="/auth/:userId/password_reset" element={<ResetPassword />} />

      <Route element={<RequireAuth />}>
        {/* IndexPage MUST render <Outlet /> for the children below to show. */}
        <Route path="/" element={<IndexPage />}>
          <Route element={<ChatLayout />}>
            <Route
              path="/chatroom/user"
              element={<Navigate to="/chatroom/user/list" replace />}
            />
            <Route path="/chatroom/user/list" element={<ChatBoxComponent />} />
            <Route path="/chatroom/user/:id" element={<ChatBoxComponent />} />
          </Route>

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route
            path="/network/invitation/requests"
            element={<NetworkInvitationRequests />}
          />
          <Route
            path="/network/manage"
            element={<Navigate to="/network/manage/follower" replace />}
          />
          <Route path="/network/manage/:tab" element={<ManageMyNetwork />} />
          <Route path="/notification" element={<NotificationPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
