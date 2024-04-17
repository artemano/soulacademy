"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { formatPrice } from "@/lib/format";

const formSchema = z.object({
  discountPrice: z.coerce.number().optional(),
});

interface DiscountPriceFormProps {

  initialData: Course;
  courseId: string;
}

const DiscountPriceForm = ({ initialData, courseId }: DiscountPriceFormProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discountPrice: initialData?.discountPrice || undefined,
    },
  });
  // Handle onSubmit function
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, data);
      toast.success("Curso actualizado ✅");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Upps...algo salió mal! 😭");
      console.log("[PRICE_FORM", error);
    }
  };
  const { isSubmitting, isValid } = form.formState;
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Precio de Oferta
        <Button variant="ghost" onClick={toggleEdit}>
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
        <>
          <p
            className={cn(
              "text-sm mt-2",
              !initialData.discountPrice && "text-slate-500 italic"
            )}
          >
            {initialData.discountPrice ? formatPrice(initialData.discountPrice) : "Sin Precio de Oferta"}
          </p>
        </>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="discountPrice"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      step="5000"
                      type="number"
                      placeholder="Ponle un precio de oferta"
                      {...field}
                    />
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

export default DiscountPriceForm;

