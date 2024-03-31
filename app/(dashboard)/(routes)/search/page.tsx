import { ServiceFactory } from "@/lib/service.factory";
import { CategoryService } from "@/services/courses";
import { Categories } from "./_components/categories";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from '@/components/courses-list';

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
};
const SearchPage = async ({
  searchParams
}: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const categoryService = ServiceFactory.getInstance("Category") as CategoryService;
  const categories = await categoryService.findMany();

  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md-mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6">
        <Categories items={categories || []} />
        <CoursesList items={courses} />
      </div>
    </>
  );
}

export default SearchPage;



