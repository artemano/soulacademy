import React from "react";
import { MobilesSidebar } from "./mobile-sidebar";
import { NavbarRoutes } from "@/components/navbar-routes";

export const Navbar = () => {
  return (
    <div className="p-4 boder-b h-full flex items-center bg-white shadow-sm ">
      <MobilesSidebar />
      <NavbarRoutes />
    </div>
  );
};
