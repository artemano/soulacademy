import { CourseMode } from "@prisma/client";

export interface CreateCourseDto {
  title: string;
  target?: string;
  goal?: string;
  teachings?: string;
  detail?: string;
  bonus?: string;
  warranty?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaShareImage?: string;
}

export interface UpdateCourseDto {
  id: string;
  userId: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  isPublished?: boolean;
  categoryId?: string;
  discountPrice?: number;
  discountDate?: Date;
  modality?: CourseMode;
}

export interface UpdateCourseDetailsDto {
  id: string;
  target?: string;
  goal?: string;
  teachings?: string;
  bonus?: string;
  warranty?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaShareImage?: string;
}