//import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { ServiceFactory } from "@/lib/service.factory";
import { CourseService } from "@/services/courses";
import { auth } from "@/auth";

export default async function CoursesPage() {
  const session = await auth();
  const userId = session?.user.username;
  if (!userId) {
    return redirect("/");
  }
  const coursesService = ServiceFactory.getInstance("Courses") as CourseService;
  const courses = await coursesService.findManyByUser(userId);

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
}
export const dynamic = 'force-dynamic';
