import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { redirect } from "next/navigation";
import { InfoCard } from "./_components/info-card";
import { CheckCircle, Clock } from "lucide-react";
import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();
  if (!session) return redirect("/");

  const {
    completedCourses, coursesInProgress
  } = await getDashboardCourses(session.user.username!)

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <InfoCard icon={Clock} label="En Progreso" numberOfItems={coursesInProgress.length} />
        <InfoCard icon={CheckCircle} label="Completos" numberOfItems={completedCourses.length} variant="success" />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>);
}
export const dynamic = 'force-dynamic';
