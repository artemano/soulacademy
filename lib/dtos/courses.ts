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
  modality: CouseMode;
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
export enum CouseMode {
  RECORDED,
  ONLINE,
  IN_PERSON,
  WORKSHOP,
  CONFERENCE,
  MASTERCLASS,
}