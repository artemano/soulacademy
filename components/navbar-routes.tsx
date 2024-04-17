"use client";

//import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import { BsPencilSquare } from "react-icons/bs";
import { LuGraduationCap, LuKeyRound, LuLogOut } from "react-icons/lu";

import Link from "next/link";
import { SearchInput } from "./search-input";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdArrowBack } from "react-icons/md";
import { Logo } from "./logo";
import { Badge } from "./ui/badge";
import { LoginButton } from "./auth/login-button";
import { signOut, useSession } from "next-auth/react";
import { getUserProfile } from "@/actions/get-user-profile";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSession();
  const searchParams = useSearchParams();


  const isTeacherPage = pathname?.startsWith("/teacher/courses");
  const isPlayerPage = pathname?.includes("/chapters");
  const isCoursePage = pathname?.startsWith("/courses");
  const isSearchPage = pathname === "/";
  const [isAuthor, setIsAuthor] = useState(false);
  const [queryParams, setQueryParams] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    if (user.status === "authenticated") {
      setIsAuthenticated(true)
      const userProfile = getUserProfile().then(
        (profile) => {
          const author = profile?.user.role.type === "coursecreator";
          setIsAuthor(author);
        }
      ).catch(error => console.log(error));
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  useEffect(() => {
    const queryParams = searchParams.toString();

    //console.log(queryParams);
    setQueryParams(`?${queryParams}`);
    //console.log(queryParams);
  }, [pathname]);

  const onClick = async () => {
    await signOut();
  }
  const onLogin = () => {
    router.push(`/login?callbackUrl=${pathname}${queryParams}`);
  }

  return (
    <div className="flex flex-row w-full items-center justify-between">
      <div className="flex-none gap-x-2 md:flex hover:opacity-75 transition-opacity">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      {
        isSearchPage && (
          <div className="hidden md:flex justify-center flex-1">
            <SearchInput />
          </div>
        )
      }

      <div className="flex gap-x-2 ml-auto items-center">
        {!isAuthenticated && (
          <>
            <Button size="sm" variant="outline" onClick={onLogin} className="rounded-full bg-violet-500 border-transparent text-white">
              <BsPencilSquare className="h-4 w-4 md:mr-2" />
              <span className="hidden md:block">Registro</span>
            </Button>
            <LoginButton mode="redirect">
              <Button size="sm" variant="outline" className="rounded-full bg-violet-200 text-slate-900">
                <LuKeyRound className="h-4 w-4 md:mr-2" />
                <span className="hidden md:block">Ingreso</span>
              </Button>
            </LoginButton>
          </>
        )
        }
      </div>
      {(isTeacherPage || isPlayerPage) && (
        <>
          <div className="flex gap-x-2 ml-auto mr-2 items-center">
            <Link href="/">
              <Button size="sm" variant="primary" className="rounded-full" >
                <MdArrowBack className="h-4 w-[14px] md:mr-1" />
                <span className="hidden md:block">Volver</span>
              </Button>
            </Link>
          </div>
        </>
      )}
      {(isAuthor && !isTeacherPage && !isCoursePage) && (
        <div className="gap-x-2 ml-auto items-center">
          <Link href="/teacher/courses" className="px-2">
            <Button variant="primary" className="rounded-full" size="sm">
              <LuGraduationCap className="w-4 h-5  md:mr-1" />
              <span className="hidden md:block">Autor</span>
            </Button>
          </Link>
        </div>)
      }
      {isAuthenticated && (
        <Link href="/" className="md:block">
          <Button size="sm" variant="outline" onClick={onClick} className="rounded-full">
            <LuLogOut className="h-4 w-3 md:mr-1" />
            <span className="hidden md:block">Salir</span>
          </Button>
        </Link>
      )
      }
      {
        /** <UserButton afterSignOutUrl="/" /> */
      }
    </div>
  );
};
