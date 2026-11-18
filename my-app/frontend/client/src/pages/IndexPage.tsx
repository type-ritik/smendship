import HeaderComponenet from "../components/Header/HeaderComponenet";
import { Outlet, useLocation } from "react-router-dom";
import HomeComponent from "../components/Home/HomeComponent";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const AUTH_MESSAGES: Record<string, string> = {
  login: "Logged in successfully!",
  signup: "Signed up successfully!",
  auth: "Authentication successful!",
};

function IndexPage() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let matched = false;

    for (const [key, message] of Object.entries(AUTH_MESSAGES)) {
      if (params.get(key) === "success") {
        toast.success(message, { id: key });
        matched = true;
      }
    }

    if (matched) window.history.replaceState({}, "", "/");
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-teal-50 via-white to-white">
      <Toaster
        position="top-center"
        toastOptions={{
          className: "!rounded-xl !text-sm !shadow-lg",
          duration: 3500,
        }}
      />

      <HeaderComponenet />

      {/* key on pathname replays a soft entrance on each route change */}
      <div key={location.pathname} className="anim-pop w-full pb-16 md:pb-0">
        {location.pathname === "/" && <HomeComponent />}
        <Outlet />
      </div>
    </div>
  );
}

export default IndexPage;
