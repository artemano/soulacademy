"use client";
import { BarChart, List, Compass, Layout, LogOutIcon, LucideIcon } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";

export type RouteType = {
  icon: LucideIcon;
  label: string;
  href: string;
}
const guestRoutes: RouteType[] = [
  {
    icon: Compass,
    label: "Explorar",
    href: "/",
  },
];
const signOutRoute = {
  icon: LogOutIcon,
  label: "Salir",
  href: "/",
}
const authRoutes: RouteType[] = [...guestRoutes, {
  icon: Layout,
  label: "Dashboard",
  href: "/dashboard",
}];
const teacherRoutes: RouteType[] = [
  {
    icon: List,
    label: "Cursos",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analítica",
    href: "/teacher/analytics",
  },
];

export const SidebarRoutes = () => {
  const session = useSession();
  const pathname = usePathname();

  const [isAuthenticated, setIsAuthenticatd] = useState(false);
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const onSignOut = () => {
    console.log("Bye")
    signOut();
  }

  useEffect(() => {
    const status = session.status;
    if (status === "authenticated") {
      const isTeacherPage = pathname?.includes("/teacher");
      const r = status && isTeacherPage ? teacherRoutes : status ? authRoutes : guestRoutes;
      setRoutes(r)
      setIsAuthenticatd(true);
    }
    else {
      setRoutes(guestRoutes);
      setIsAuthenticatd(false);
    }
    console.log(status, routes);

  }, [pathname, session]);
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
      {isAuthenticated && (
        <div className="absolute bottom-0 w-full">
          <hr />
          <Separator className="my-4" />
          <Button variant="ghost" onClick={onSignOut} className="flex items-left justify-start gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 h-14">
            <LogOutIcon />
            Salir
          </Button>
        </div>
      )}
    </div>
  );
};
