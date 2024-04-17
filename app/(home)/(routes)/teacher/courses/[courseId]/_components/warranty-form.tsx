"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { CourseDetail } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { TipTap } from "@/components/tip-tap";


const formSchema = z.object({
  warranty: z.string().min(10, {
    message: "La descripción de garantía es requerida para ofrecer tu curso",
  }),
});

interface WarrantyFormProps {
  initialData: CourseDetail;
  courseId: string;
}

const WarrantyForm = ({ initialData, courseId }: WarrantyFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      warranty: initialData?.warranty || "",
    },
  });
  // Handle onSubmit function
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/details`, data);
      toast.success("Curso actualizado ✅");
      setContent(data.warranty);
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Upps...algo salió mal! 😭");
      console.log("[DESCRIPTION_FORM", error);
    }
  };
  const { isSubmitting, isValid } = form.formState;
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialData.warranty ?? "");

  useEffect(() => {
    console.log(initialData.warranty);
  }, [initialData.warranty]);

  const router = useRouter();
  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-rose-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Garantía
        <Button variant="ghost" onClick={toggleEdit} className="hover:bg-rose-100 hover:transition-all">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" /> Editar{" "}
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <div
          className={cn(
            "text-sm mt-2 overflow-scroll no-scrollbar",
            !initialData.warranty && "text-slate-500 italic"
          )}
        >
          {!initialData.warranty && "Sin descripción de beneficios"}
          {initialData.warranty && (
            <TipTap value={content} readonly />
          )}
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="warranty"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TipTap {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default WarrantyForm;
