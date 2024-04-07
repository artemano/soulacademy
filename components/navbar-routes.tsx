"use client";

//import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import { BsPencilSquare } from "react-icons/bs";

import Link from "next/link";
import { SearchInput } from "./search-input";
import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdArrowBack } from "react-icons/md";
import { Logo } from "./logo";
import { Badge } from "./ui/badge";
const apiEndpoint = process.env.NEXT_PUBLIC_API;

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
  const getUserProfile = async () => {
    try {
      const endPoint = `${apiEndpoint}user/me`;
      const req = await fetch(endPoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await req.json();
      //console.log(reset);
      if (response?.success) {
        return response;
      } else {
        return response.message;
      }
    } catch (error) {
      toast.error(`Error obteniendo datos del usuario: ${error} `);
      console.error(error);
      return Promise.reject(error);
    }
  }

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
    console.log("ISTEACHER PAGE", isTeacherPage);
    console.log("isPLAYER PAGE", isPlayerPage);
    //console.log(queryParams);
    setQueryParams(`?${queryParams}`);
    //console.log(queryParams);
  }, [pathname]);

  const onClick = () => {
    signOut();
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

      <div className="hidden sm:flex gap-x-2 ml-auto items-center">
        {!isAuthenticated && (
          <>
            <Button size="sm" variant="outline" onClick={onLogin} className="rounded-full bg-violet-500 border-transparent text-white">
              <BsPencilSquare className="h-4 w-4 mr-2" />
              Registro
            </Button>
            <Button size="sm" variant="outline" onClick={onLogin} className="rounded-full bg-violet-200 text-slate-900">
              <LogIn className="h-4 w-4 mr-2" />
              Ingreso
            </Button>
          </>
        )
        }
      </div>
      {(isTeacherPage || isPlayerPage) && (
        <>
          <div className="hidden sm:flex gap-x-2 ml-auto mr-2 items-center">
            <Link href="/">
              <Button size="sm" variant="primary" className="rounded-full" >
                <MdArrowBack className="h-4 w-4 mr-2" />Volver
              </Button>
            </Link>
          </div>
        </>
      )}
      {(isAuthor && !isTeacherPage && !isCoursePage) && (
        <div className="gap-x-2 ml-auto items-center">
          <Link href="/teacher/courses" className="px-4">
            <Button variant="primary" className="rounded-full">
              Modo Autor
            </Button>
          </Link>
        </div>)
      }
      {isAuthenticated && (
        <Link href="/" className="hidden md:block">
          <Button size="sm" variant="outline" onClick={onClick}>
            <LogOut className="h-4 w-4" />
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
