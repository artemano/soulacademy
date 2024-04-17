"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { DateTimePicker } from "@/components/date-time-picker";
import { formatDate, formatLocaleDate } from '../../../../../../lib/utils';


const formSchema = z.object({
    startDate: z.date(),
    endDate: z.date(),
}).refine((data) => data.startDate.getDate() < data.endDate.getDate(), {
    message: "Fecha de finalización debe ser posterior a fecha de inicio",
    path: ["endDate"],
}).refine((data) => data.startDate > new Date(), {
    message: "Fecha de Inico debe ser superior a fecha actua",
    path: ["startDate"],
});

interface DatesFormProps {
    initialData: Course;
    courseId: string;
}

const DatesForm = ({ initialData, courseId }: DatesFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            startDate: initialData?.startDate || undefined,
            endDate: initialData?.endDate || undefined,
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
            console.log("[DESCRIPTION_FORM", error);
        }
    };
    const { isSubmitting, isValid } = form.formState;
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const toggleEdit = () => setIsEditing((current) => !current);

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Fechas del Curso
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
                <div
                    className={cn(
                        "text-sm mt-2",
                        !initialData.endDate && "text-slate-500 italic"
                    )}
                >
                    <div className="pl-2 pt-1">
                        <span className="font-semibold">Fecha Inicio:</span> {formatLocaleDate(initialData.startDate!, true) || "Sin fecha de Inicio"}
                    </div>
                    <div className="pl-2 pt-1">
                        <span className="font-semibold">Fecha Fin:</span> {formatLocaleDate(initialData.endDate!, true) || "Sin fecha de Inicio"}
                    </div>
                </div>
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <DateTimePicker disabled={isSubmitting} placeholder="Fecha Inicio" date={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <DateTimePicker disabled={isSubmitting} placeholder="Fecha Fin" date={field.value} onChange={field.onChange} />
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

export default DatesForm;