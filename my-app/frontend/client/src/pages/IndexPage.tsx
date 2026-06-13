// import { useEffect, useState } from "react";
import HeaderComponenet from "../components/Header/HeaderComponenet";
import { Outlet, useLocation } from "react-router-dom";
import HomeComponent from "../components/Home/HomeComponent";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

function IndexPage() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("login") == "success") {
      toast.success("Logged in successfully!");
      window.history.replaceState({}, "", "/");
    }

    if (params.get("signup") == "success") {
      toast.success("Signed up successfully!");
      window.history.replaceState({}, "", "/");
    }
  }, []);

  return (
    <>
      <div className="relative">
        <Toaster />
        <HeaderComponenet />
      </div>
      <div className="w-full">
        {location.pathname === "/" && <HomeComponent />}
        <Outlet />
      </div>
    </>
  );
}

export default IndexPage;
