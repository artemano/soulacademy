import { auth } from "@/actions/auth";
import { redirect } from "next/navigation";


const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/")
    }
    return (
        <div className="h-full">
            <main className="h-full">
                <div className="w-full h-6 text-center bg-sky-500 text-white align-middle items-center font-semibold">Modo creación</div>
                {children}
            </main>
        </div>
    );
};

export default TeacherLayout;