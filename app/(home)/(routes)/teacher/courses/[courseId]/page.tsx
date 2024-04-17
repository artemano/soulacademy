import IconBadge from "@/components/icon-badge";
import { ServiceFactory } from "@/lib/service.factory";
//import { auth } from "@clerk/nextjs";
import {
  CircleDollarSign,
  LayoutDashboard,
  ListChecks,
  File,
  Magnet
} from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import { CourseService } from "@/services/courses";
import { CategoryService } from "@/services/courses";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";
import ChaptersForm from "./_components/chapters-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";
import DiscountPriceForm from "./_components/discount-form";
import GoalsForm from "./_components/goals-form";
import TargetForm from "./_components/target-form";
import TeachingsForm from "./_components/teachings-form";
import DatesForm from "./_components/dates-form";
import ModalityForm from "./_components/modality-form";
import { auth } from "@/auth";
import BonusForm from "./_components/bonus-form";
import WarrantyForm from "./_components/warranty-form";

const CourseDetailPage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  try {
    const session = await auth();
    const userId = session?.user.username;

    if (!userId) return redirect("/");

    const coursesService = ServiceFactory.getInstance(
      "Courses"
    ) as CourseService;

    const course = await coursesService.findById(params.courseId, userId);

    console.log(params.courseId, course?.chapters);

    const categoryService = ServiceFactory.getInstance(
      "Category"
    ) as CategoryService;

    const categories = await categoryService.findMany()!;

    if (!course) return redirect("/");

    const requiredFields = [
      course.title,
      course.description,
      course.imageUrl,
      course.price,
      course.discountPrice,
      course.categoryId,
      course.detail?.goal,
      course.detail?.target,
      course.detail?.teachings,
      course.chapters.some((chapter) => chapter.isPublished),
    ];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);
    return (
      <> {
        !course.isPublished && (
          <div className="w-full">
            <Banner label="Este curso aún no ha sido publicado, no aparecerá visible en el mercado" />
            {
              requiredFields.map((field, key) => (
                <p key={key}>{field}</p>
              ))
            }
          </div>
        )
      }
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Configuración del Curso</h1>
              <span className="text-sm text-slate-700">
                Completa todos los campos {completionText}
              </span>
            </div>
            <Actions disabled={!isComplete} courseId={params.courseId} isPublished={course.isPublished} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-2xl font-semibold text-slate-600">Personaliza tu curso</h2>
              </div>
              <TitleForm initialData={course} courseId={course.id} />
              <DescriptionForm initialData={course} courseId={course.id} />
              <ImageForm initialData={course} courseId={course.id} />
              <ModalityForm initialData={course} courseId={course.id} />
              <CategoryForm
                initialData={course}
                courseId={course.id}
                options={categories!.map((cat) => {
                  return {
                    label: cat.name,
                    value: cat.id,
                  };
                })}
              />
              <div className="mt-8">
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-2xl font-semibold text-slate-600">Lecciones del Curso</h2>
                </div>
                <ChaptersForm initialData={course} courseId={course.id} />
              </div>
              <div>
                <div className="flex items-center gap-x-2 mt-7">
                  <IconBadge icon={File} />
                  <h2 className="text-2xl font-semibold text-slate-600">Recursos y Anexos</h2>
                </div>
                <AttachmentForm initialData={course} courseId={course.id} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Magnet} />
                <h2 className="text-2xl font-semibold text-slate-600">Mercadea tu curso</h2>
              </div>
              <GoalsForm initialData={course.detail!} courseId={course.id} />
              <TargetForm initialData={course.detail!} courseId={course.id} />
              <TeachingsForm initialData={course.detail!} courseId={course.id} />

              <div className="flex items-center gap-x-2 mt-7">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-2xl font-semibold text-slate-600">Vende tu curso</h2>
              </div>
              <div>
                <PriceForm initialData={course} courseId={course.id} />
              </div>
              <div>
                <DiscountPriceForm initialData={course} courseId={course.id} />
              </div>
              <div>
                <DatesForm initialData={course!} courseId={course.id} />
              </div>

              <div className="flex items-center gap-x-2 mt-7">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-2xl font-semibold text-slate-600">Mejora tu Propuesta de Valor</h2>
              </div>
              <BonusForm initialData={course.detail!} courseId={course.id} />
              <WarrantyForm initialData={course.detail!} courseId={course.id} />
            </div>

          </div>
        </div>
      </>
    );
  } catch (error) {
    redirect("/");
  }
};

export default CourseDetailPage;
