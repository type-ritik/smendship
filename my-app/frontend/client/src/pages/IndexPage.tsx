// import { useEffect, useState } from "react";
import HeaderComponenet from "../components/Header/HeaderComponenet";
import { Outlet, useLocation } from "react-router-dom";
import HomeComponent from "../components/Home/HomeComponent";

function IndexPage() {
  const location = useLocation();

  return (
    <>
      <div className="relative">
        <HeaderComponenet />
      </div>
      <div className="w-full mt-30!">
        {location.pathname === "/" && <HomeComponent />}
        <Outlet />
      </div>
    </>
  );
}

export default IndexPage;
