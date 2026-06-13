import "./App.css";
import LoginComponent from "./components/Auth/LoginComponent";
import { Route, Routes, useNavigate } from "react-router-dom";
import SignupComponent from "./components/Auth/SignupComponent";
import IndexPage from "./pages/IndexPage";
import ChatBoxComponent from "./components/Chat/ChatBoxComponent";
import UsersChatList from "./components/Chat/UsersChatList";
// import { useState } from "react";
import NetworkPage from "./pages/NetworkPage";
import NetworkInvitationRequests from "./components/Network/NetworkInvitationRequests";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import type { UserObjState } from "./utils/userInterfaces";
import ManageMyNetwork from "./pages/ManageMyNetwork";

function App() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: UserObjState) => state.user);

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth/login");
    }
  }, [navigate, currentUser]);

  return (
    <>
      <Routes>
        <Route path="/auth/login" element={<LoginComponent />} />
        <Route path="/auth/signup" element={<SignupComponent />} />
        <Route path="/" element={<IndexPage />}>
          <Route path="message" element={<ChatBoxComponent />} />
          <Route path="chat/user/list" element={<UsersChatList />} />
          <Route path="profile" element={<h1>Profile</h1>} />
          <Route path="network" element={<NetworkPage />} />
          <Route
            path="network/invitation/requests"
            element={<NetworkInvitationRequests />}
          />
          <Route path="network/manage" element={<ManageMyNetwork />} />
          <Route path="notification" element={<h1>Notification</h1>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
