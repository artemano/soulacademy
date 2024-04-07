"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
    disabled: boolean;
    isPublished: boolean;
    chapterId: string;
    courseId: string;
}
export const ChapterActions = ({ disabled, isPublished, chapterId, courseId }: ChapterActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const onClick = async () => {
        try {
            setIsLoading(true);
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
                toast.success("Capitulo despublicado ✅");
            }
            else {
                console.log("publish")
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                toast.success("Capitulo publicado ✅");
            }
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error("opps!!! Al parecer algo salió mal..😭");
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast.success("Capítulo eliminado correctamente");
            router.push(`/teacher/courses/${courseId}`);
            router.refresh();
        } catch (error) {
            toast.error("Upps, algo salió mal 😭");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="flex items-center gap-x-2">
            <Button onClick={onClick} disabled={disabled || isLoading} variant="outline" size="sm">
                {isPublished ? "Despublicar" : "Publicar"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}