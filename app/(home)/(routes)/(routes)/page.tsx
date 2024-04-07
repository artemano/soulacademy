import { ServiceFactory } from "@/lib/service.factory";
import { CategoryService } from "@/services/courses";
import { Categories } from "./_components/categories";
//import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";
import { auth } from "@/actions/auth";
import { getCoursesPublic } from "@/actions/get-courses-public";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
};
const SearchPage = async ({
  searchParams
}: SearchPageProps) => {
  const { userId } = await auth();
  const { title, categoryId } = searchParams;
  const categoryService = ServiceFactory.getInstance("Category") as CategoryService;
  const categories = await categoryService.findMany();

  const courses = userId ? await getCourses({
    userId,
    ...searchParams,
  }) : await getCoursesPublic({ title, categoryId });
  console.log(courses);
  return (
    <div className="w-full flex flex-col">
      <div className="md:hidden mb-2 flex-1 px-6 pt-6 ">
        <SearchInput />
      </div>
      <hr />
      <div className="w-full p-6 flex flex-col">
        <Categories items={categories || []} />
        <CoursesList items={courses} />
      </div>
    </div>
  );
}

export default SearchPage;



