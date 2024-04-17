"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
  label: string;
  icon: LucideIcon;
  href: string;
  className?: string;
}
export const SidebarItem = ({ label, icon: Icon, href, className }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const onClick = () => {
    router.push(href);
  };
  const isActive =
    ((pathname === "/" && href === "/") ||
      pathname === href ||
      pathname.startsWith(`${href}/`)) && label !== "Salir";
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex w-full items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 group",
        isActive &&
        "text-purple-700 bg-purple-200/20 hover:bg-purple-200/20 hover:text-purple-700", className
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-slate-500", isActive && "text-purple-700 group-hover:bg-transparent", className ? className + "bg-transparent group-hover:bg-transparent group-hover:text-slate-500" : "")}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-purple-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};
