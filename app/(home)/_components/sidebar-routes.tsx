"use client";
import { BarChart, List, Compass, Layout, LogOutIcon, LucideIcon, KeyRoundIcon, PenSquareIcon, GraduationCapIcon, ArrowLeftCircleIcon } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { signOut, useSession } from "next-auth/react";
import { LoginButton } from "@/components/auth/login-button";
import { getUserProfile } from "@/actions/get-user-profile";

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

const signInRoute = {
  icon: KeyRoundIcon,
  label: "Ingresar",
  href: "/login",
}
const signUpRoute = {
  icon: PenSquareIcon,
  label: "Crear Cuenta",
  href: "/register"
}
const authorRoute = {
  icon: GraduationCapIcon,
  label: "Modo Autor",
  href: "/teacher/courses",
}

const backRoute = {
  icon: ArrowLeftCircleIcon,
  label: "Retornar",
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
  const isTeacherPage = pathname?.startsWith("/teacher/courses");
  const isPlayerPage = pathname?.includes("/chapters");
  const [isAuthor, setIsAuthor] = useState(false);
  const [isAuthenticated, setIsAuthenticatd] = useState(false);
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const onSignOut = async () => {
    console.log("Bye")
    await signOut();
  }

  useEffect(() => {
    const status = session.status;
    if (status === "authenticated") {
      const isTeacherPage = pathname?.includes("/teacher");
      const r = status && isTeacherPage ? teacherRoutes : status ? authRoutes : guestRoutes;
      setRoutes(r)
      setIsAuthenticatd(true);
      const userProfile = getUserProfile().then(
        (profile) => {
          const author = profile?.user.role.type === "coursecreator";
          console.log("IS_AUTOR", author);
          setIsAuthor(author);
        }
      ).catch(error => console.log(error));
    }
    else {
      setRoutes(guestRoutes);
      setIsAuthenticatd(false);
      setIsAuthor(false);
    }
    console.log(status, routes);

  }, [pathname, session]);
  return (
    <div className="flex flex-col w-full">
      {
        !isAuthenticated && (
          <div className="w-full md:hidden px-3 rounded-md">
            <hr />
            <Separator className="my-4" />
            <LoginButton asChild>
              <SidebarItem
                icon={signInRoute.icon}
                label={signInRoute.label}
                href={signInRoute.href}
                className="bg-violet-900 text-white rounded-t-md"
              />
            </LoginButton>
            <SidebarItem
              icon={signUpRoute.icon}
              label={signUpRoute.label}
              href={signUpRoute.href}
              className="bg-violet-900 text-white rounded-b-md"
            />
            <Separator className="my-4" />
          </div>
        )
      }
      {
        (isAuthor && !isTeacherPage && !isPlayerPage) && (
          <div className="w-full md:hidden px-3 rounded-md">
            <SidebarItem
              icon={authorRoute.icon}
              label={authorRoute.label}
              href={authorRoute.href}
              className="bg-violet-900 text-white rounded-md"
            />
            <hr />
            <Separator className="my-4" />
          </div>
        )
      }
      {
        (isTeacherPage || isPlayerPage) && (
          <div className="w-full md:hidden px-3 rounded-md">
            <SidebarItem
              icon={backRoute.icon}
              label={backRoute.label}
              href={backRoute.href}
              className="bg-violet-900 text-white rounded-md"
            />
            <hr />
            <Separator className="my-4" />
          </div>
        )
      }

      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}

      {isAuthenticated && (
        <div className="absolute bottom-0 w-full md:hidden px-3 rounded-md mb-3">
          <Button variant="ghost" onClick={onSignOut} className="flex items-left justify-start gap-x-2 text-white text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 h-14 bg-violet-900 w-full">
            <LogOutIcon />
            Salir
          </Button>
        </div>
      )}
    </div>
  );
};
