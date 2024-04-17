import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export const MobilesSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-1 hover:opacity-75 transition">
        <Menu className="text-purple-700" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
