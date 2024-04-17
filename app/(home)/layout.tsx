import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full no-scrollbar">
      <div className="h-[80px] fixed inset-y-0 w-full z-[1]">
        <Navbar />
      </div>
      <main className="flex flex-row w-full">
        <div className="hidden top-[80px] md:flex w-44 flex-col fixed inset-y-0 shadow-lg">
          <Sidebar />
        </div>
        <div className="w-full md:pl-44 pt-[80px]">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
