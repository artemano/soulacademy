"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
    disabled: boolean;
    isPublished: boolean;
    courseId: string;
}
export const Actions = ({ disabled, isPublished, courseId }: ActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const confettiStore = useConfettiStore();
    const onClick = async () => {
        try {
            setIsLoading(true);
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Capitulo despublicado ✅");
            }
            else {
                console.log("publish")
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Capitulo publicado ✅");
                confettiStore.onOpen();
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
            await axios.delete(`/api/courses/${courseId}`);
            toast.success("Curso eliminado correctamente");
            router.push(`/teacher/courses`);
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