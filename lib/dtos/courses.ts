export interface CreateCourseDto {
  title: string;
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
}
