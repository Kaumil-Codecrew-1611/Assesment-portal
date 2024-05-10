import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../views/Dashboard/SideBar";
import UserProfile from "../views/Dashboard/UserProfile";
import Footer from "../views/footer/Footer";

const Layout = ({ user }) => {
  return (
    <>
      <SideBar user={user} />
      <div className="sm:ml-64 flex justify-between flex-col h-screen">
        <div>
          <UserProfile user={user} />
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
