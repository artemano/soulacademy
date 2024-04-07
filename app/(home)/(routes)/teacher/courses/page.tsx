//import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { ServiceFactory } from "@/lib/service.factory";
import { CourseService } from "@/services/courses";
import { auth } from "@/actions/auth";

const CoursesPage = async () => {
  const { userId } = await auth();
  console.log(userId);
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

export default CoursesPage;