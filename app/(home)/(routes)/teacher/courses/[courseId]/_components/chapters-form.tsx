"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { ChaptersList } from "./chapters-list";
import { ServiceFactory } from "@/lib/service.factory";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}
const formSchema = z.object({
  title: z.string().min(1, {
    message: "La descripción debe tener al menos 1 caracteres",
  }),
});



const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const toggleCreating = () => setIsCreating((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  // Handle onSubmit function
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, data);
      toast.success("Capítulo creado ✅");
      toggleCreating();
      form.reset({ title: "" });
      router.refresh();
    } catch (error) {
      toast.error("Upps...algo salió mal! 😭");
      console.log("[DESCRIPTION_FORM", error);
    }
  };

  const onReoder = async (udpateData: { id: string, position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: udpateData
      });
      toast.success("Capitulos reorganizados correctamente");
      router.refresh();
    } catch (error) {
      toast.error("Upps, algo salió mal 😭");
    } finally {
      setIsUpdating(false);
    }
  }

  const onEdit = async (id: string) => {
    console.log(id, courseId);
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Capítulos del curso
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" /> Agregar{" "}
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="p.e: 'Introducción al curso...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Crear
              </Button>
            </div>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn("text-sm mt-2", !initialData.chapters.length && "text-slate-500 italic")}>
          {!initialData.chapters.length && "Sin capítulos aún"}
          {
            <ChaptersList onEdit={onEdit}
              onReorder={onReoder}
              items={initialData.chapters || []} />
          }
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">Arrastre los capítulos para reordenar</p>
      )}
    </div>
  );
};

export default ChaptersForm;
