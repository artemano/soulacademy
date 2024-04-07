"use client";

import axios from "axios";
import * as z from "zod";

import { Button } from "@/components/ui/button";

import {
  File,
  ImageIcon,
  Loader2,
  Pencil,
  PlusCircleIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";
import { ServiceFactory } from "@/lib/service.factory";
import { AttachmentService } from "@/services/courses";

const formSchema = z.object({
  url: z.string().min(1),
});

interface AttachmentFormProps {
  initialData: Course & {
    attachments: Attachment[];
  };
  courseId: string;
}

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  // Handle onSubmit function
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, data);
      toast.success("Curso actualizado ✅");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Upps...algo salió mal! 😭");
      console.log("[ATTACHMENTS_FORM", error);
    }
  };
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();
  const toggleEdit = () => setIsEditing((current) => !current);
  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Anexo eliminado");
      router.refresh();
    } catch (error) {
      console.log("Upps...algo salió mal! 😭", error);
      toast.error("Upps, algo salió mal!! 😭");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Anexos del Curso
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircleIcon className="h-4 w-4 mr-2" /> Agregar archivo{" "}
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">Sin anexos aún</p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      className="ml-auto hover:opacity-75 transition"
                      onClick={() => onDelete(attachment.id)}
                    >
                      <X className="h-4 w-4 " />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Agregue los recursos que los estudiantes necesitan para el curso.
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
