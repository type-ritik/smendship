import "./App.css";
import LoginComponent from "./components/Auth/LoginComponent";
import { Route, Routes } from "react-router-dom";
import SignupComponent from "./components/Auth/SignupComponent";
import IndexPage from "./pages/IndexPage";
import ChatBoxComponent from "./components/Chat/ChatBoxComponent";
import UsersChatList from "./components/Chat/UsersChatList";
// import { useState } from "react";
import NetworkPage from "./pages/NetworkPage";
import NetworkInvitationRequests from "./components/Network/NetworkInvitationRequests";

function App() {
  // const [chatUserId, setChatUserId] = useState("");
  return (
    <>
      <Routes>
        <Route path="auth/login" element={<LoginComponent />} />
        <Route path="auth/signup" element={<SignupComponent />} />
        <Route path="/" element={<IndexPage />}>
          <Route path="/message" element={<ChatBoxComponent />} />
          <Route path="/chat/user/list" element={<UsersChatList />} />
          <Route path="/profile" element={<h1>Profile</h1>} />
          <Route path="/network" element={<NetworkPage />} />
          <Route
            path="/network/invitation/requests"
            element={<NetworkInvitationRequests />}
          />
          <Route path="/notification" element={<h1>Notification</h1>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
