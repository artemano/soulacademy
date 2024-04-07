import React from "react";
import { MobilesSidebar } from "./mobile-sidebar";
import { NavbarRoutes } from "@/components/navbar-routes";

export const Navbar = () => {
  return (
    <nav className="p-4 boder-b h-full flex items-center bg-slate-800 shadow-sm">
      <div className="flex w-full mx-auto sm:px-6 bg-transparent justify-between items-center">
        <MobilesSidebar />
        <NavbarRoutes />
      </div>
    </nav>
  );
};
