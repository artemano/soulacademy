import { ServiceFactory } from "@/lib/service.factory";
import { CategoryService } from "@/services/courses";
import { Categories } from "./_components/categories";
//import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";
import { getCoursesPublic } from "@/actions/get-courses-public";
import { auth } from "@/auth";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
};
export default async function SearchPage({
  searchParams
}: SearchPageProps) {
  const session = await auth();
  const userId = session?.user.username;
  const { title, categoryId } = searchParams;
  const categoryService = ServiceFactory.getInstance("Category") as CategoryService;
  const categories = await categoryService.findMany();

  const courses = userId ? await getCourses({
    userId,
    ...searchParams,
  }) : await getCoursesPublic({ title, categoryId });
  return (
    <div className="w-full flex flex-col">
      <div className="md:hidden mb-2 flex-1 pr-4  pt-4 ">
        <SearchInput />
      </div>
      <hr />
      <div className="w-full p-4 flex flex-col">
        <Categories items={categories || []} />
        <CoursesList items={courses} />
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
