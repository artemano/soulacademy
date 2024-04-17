"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course, CourseMode } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/combobox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseOptions as options } from "@/app/utils/model";


interface ModalityFormProps {
    initialData: Course;
    courseId: string;
}


const formSchema = z.object({
    modality: z.string().min(1),
});

const ModalityForm = ({
    initialData,
    courseId,
}: ModalityFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            modality: initialData?.modality || "RECORDED",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            console.log(values);
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Curso actualizado");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Upps, algo salió mal... 😭");
        }
    };

    const selectedOption = options.find(
        (option) => option.value === initialData.modality
    );

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Modalidad
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancelar</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p
                    className={cn(
                        "text-sm mt-2",
                        !initialData.modality && "text-slate-500 italic"
                    )}
                >
                    {selectedOption?.label || "Sin Modalidad"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="modality"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Modalidad" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {options.map((option, index) => (
                                                <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                                            ))
                                            }
                                        </SelectContent>
                                    </Select>
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
export default ModalityForm;
