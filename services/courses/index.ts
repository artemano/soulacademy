import { db } from "@/lib/db";
import { CreateCourseDto, UpdateCourseDetailsDto, UpdateCourseDto } from "@/lib/dtos/courses";
import { AppException, ErrorType } from "@/lib/exception/app-exception";
import { ServiceFactory } from "@/lib/service.factory";
import { Prisma, Chapter, Category, Course } from '@prisma/client';

export type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

export type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};
export type GetCoursesPublic = {
  title?: string,
  categoryId?: string
}

export class CourseService {
  constructor() { }

  public async findByIdLazy(id: string, userId: string) {
    try {
      const course = await db.course.findUnique({
        where: {
          id: id,
          userId,
        },
      });
      if (!course) {
        return null;
      }
      return course;
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }
  }

  public async findById(id: string, userId: string) {
    try {
      const course = await db.course.findUnique({
        where: {
          id: id,
          userId,
        },
        include: {
          chapters: {
            orderBy: {
              position: "asc",
            },
            include: {
              muxData: true,
            }
          },
          detail: true,
          attachments: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
      if (!course) {
        return null;
      }
      return course;
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }
  }

  public async searchCourses(userId: string, title?: string, categoryId?: string) {
    try {
      const courses = await db.course.findMany({
        where: {
          isPublished: true,
          title: {
            contains: title,
          },
          categoryId,
        },
        include: {
          category: true,
          chapters: {
            where: {
              isPublished: true,
            },
            select: {
              id: true,
            }
          },
          purchases: {
            where: {
              userId,
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        }
      });
      const progressService = ServiceFactory.getInstance("UserProgress") as UserProgressService;
      const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
        courses.map(async course => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            }
          }

          const progressPercentage = await progressService.findCompletedByUser(userId, course.id);

          return {
            ...course,
            progress: progressPercentage,
          };
        })
      );

      return coursesWithProgress;
    } catch (error) {
      // retuns empty array if not found any resultas
      console.log("[GET_COURSES]", error);
      return [];
    }
  }

  public async publicSearch(title?: string, categoryId?: string) {
    try {
      const courses = await db.course.findMany({
        where: {
          isPublished: true,
          title: {
            contains: title,
          },
          categoryId,
        },
        include: {
          category: true,
          chapters: {
            where: {
              isPublished: true,
            },
            select: {
              id: true,
            }
          },
        },
        orderBy: {
          createdAt: "desc",
        }
      });
      const courserWithCategory: CourseWithProgressWithCategory[] = courses.map(course => {
        const progressPercentage = null;
        return {
          ...course,
          progress: progressPercentage,
        };
      })
      return courserWithCategory;
    } catch (error) {
      // retuns empty array if not found any resultas
      console.log("[GET_COURSES_PUBLIC]", error);
      return [];
    }
  }

  public async findByUser(courseId: string, userId: string) {
    try {
      const course = await db.course.findUnique({
        where: {
          id: courseId,
          userId,
        },
      });
      if (!course) {
        return null;
      }
      return course;
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }
  }

  public async findManyByUser(userId: string) {
    try {
      const courses = await db.course.findMany({
        where: {
          userId,
        },
      });
      if (!courses) {
        return [];
      }
      return courses;
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }
  }

  public async create(userId: string, data: CreateCourseDto) {
    try {
      const course = await db.course.create({
        data: {
          userId,
          title: data.title,
          detail: {
            create: {
              target: "",
              goal: "",
              teachings: "",
              bonus: "",
              warranty: "",
              metaTitle: "",
              metaDescription: "",
              metaShareImage: "",
            }
          }
        },
      });
      if (!course) {
        throw new AppException(
          ErrorType.INVALID_ARGUMENTS_ERROR,
          "Error creando curso"
        );
      }
      return course;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (error.code.startsWith("P20")) {
          console.log("Ya existe un curso con este mismo nombre");
          throw new AppException(
            ErrorType.INVALID_ARGUMENTS_ERROR,
            error.message
          );
        }
        throw new AppException(ErrorType.GENERAL_ERROR, error.message);
      }
      throw error;
    }
  }

  public async update(
    userId: string,
    courseId: string,
    values: UpdateCourseDto
  ) {
    try {
      const course = await db.course.update({
        where: {
          userId,
          id: courseId,
        },
        data: {
          ...values,
        },
      });
      if (!course) {
        throw new AppException(
          ErrorType.INVALID_ARGUMENTS_ERROR,
          "Error actualizando curso"
        );
      }
      return course;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (error.code.startsWith("P20")) {
          console.log("Ya existe un curso con este mismo nombre");
          throw new AppException(
            ErrorType.INVALID_ARGUMENTS_ERROR,
            error.message
          );
        }
        throw new AppException(ErrorType.GENERAL_ERROR, error.message);
      }
      throw error;
    }
  }

  public async updateDetails(
    courseId: string,
    values: UpdateCourseDetailsDto
  ) {
    try {
      const course = await db.courseDetail.update({
        where: {
          courseId: courseId,
        },
        data: {
          ...values,
        },
      });
      if (!course) {
        throw new AppException(
          ErrorType.INVALID_ARGUMENTS_ERROR,
          "Error actualizando curso"
        );
      }
      return course;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        throw new AppException(ErrorType.GENERAL_ERROR, error.message);
      }
      throw error;
    }
  }

  public async publishAction(
    userId: string,
    courseId: string,
    publish: boolean
  ) {
    try {
      const values = {
        isPublished: publish
      };

      const course = await db.course.update({
        where: {
          id: courseId,
          userId: userId,
        },
        data: {
          ...values
        },
      });
      if (!course) {
        throw new AppException(
          ErrorType.INVALID_ARGUMENTS_ERROR,
          "Error publicando o despublicando curso"
        );
      }
      console.log(`Curso ${publish ? 'publicado' : 'despublicado'} correctamente`, course);
      return course;
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (error.code.startsWith("P20")) {
          console.log("Ya existe un curso con este mismo nombre");
          throw new AppException(
            ErrorType.INVALID_ARGUMENTS_ERROR,
            error.message
          );
        }
        throw new AppException(ErrorType.GENERAL_ERROR, error.message);
      }
      throw error;
    }
  }

  public async delete(courseId: string) {
    try {
      const deletedCourse = db.course.delete({ where: { id: courseId } });
      if (deletedCourse) return deletedCourse;
      return null;
    } catch (error) {
      console.error(error);
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }
  }
}


export class CategoryService {
  constructor() { }

  public async findMany() {
    try {
      const categories = await db.category.findMany({
        orderBy: { name: "asc" },
      });
      if (!categories) {
        return null;
      }
      return categories;
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }
  }
}

export class AttachmentService {
  constructor() { }

  public async create(url: string, courseId: string) {
    try {
      const name = url.split("/").pop();
      if (!name) {
        throw new AppException(
          ErrorType.INVALID_ARGUMENTS_ERROR,
          "Error en la ruta del anexo"
        );
      }
      const attachment = await db.attachment.create({
        data: {
          url,
          courseId,
          name,
        },
      });
      if (!attachment) {
        throw new AppException(
          ErrorType.INVALID_ARGUMENTS_ERROR,
          "Error creando anexo"
        );
      }
      console.log(attachment);
      return attachment;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (error.code.startsWith("P20")) {
          console.log("Ya existe un anexo con este mismo nombre");
          throw new AppException(
            ErrorType.INVALID_ARGUMENTS_ERROR,
            error.message
          );
        }
        throw new AppException(ErrorType.GENERAL_ERROR, error.message);
      }
      throw error;
    }
  }

  public async delete(attachmentId: string, courseId: string) {
    try {
      const id = await db.attachment.delete({
        where: {
          id: attachmentId,
          courseId,
        },
      });
      return id;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        console.log("Error borrando el anexo", error.message);
        if (error.code.startsWith("P20")) {
          throw new AppException(
            ErrorType.INVALID_ARGUMENTS_ERROR,
            error.message
          );
        }
        throw new AppException(ErrorType.GENERAL_ERROR, error.message);
      }
      throw error;
    }
  }

  public async findById(attachmentId: string) {
    try {
      const attachment = await db.attachment.findUnique({
        where: {
          id: attachmentId,
        },
      });
      if (!attachment) {
        return null;
      }
      return attachment;
    } catch (error) {
      console.error(error);
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }

  }
}

export class ChapterService {
  constructor() { }

  public async findFirst(courseId: string) {
    try {
      const chapter = await db.chapter.findFirst({
        where: {
          id: courseId,
        },
        orderBy: {
          position: "desc"
        }
      });
      if (!chapter) {
        return null;
      }
      return chapter;
    } catch (error) {
      console.error(error);
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }

  }
  public async findByCourse(courseId: string, published: boolean) {
    try {
      const chapters = await db.chapter.findMany({
        where: {
          courseId: courseId,
          isPublished: published
        },
      });
      if (!chapters) return null;
      return chapters;
    } catch (error) {
      console.log(error);
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }
  }

  public async findById(chapterId: string, courseId: string) {
    try {
      const chapter = await db.chapter.findUnique({
        where: {
          id: chapterId,
          courseId
        },
        include: {
          muxData: true,
        }
      });
      if (!chapter) return null;
      return chapter;
    } catch (error) {
      console.log(error);
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }
  }

  public async create(title: string, courseId: string, position: number) {
    try {
      const chapter = await db.chapter.create({
        data: {
          title,
          courseId,
          position,
        }
      });
      if (!chapter) {
        throw new AppException(
          ErrorType.INVALID_ARGUMENTS_ERROR,
          "Error creando capítulo"
        );
      }
      return chapter;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (error.code.startsWith("P20")) {
          console.log("Ya existe un capítulo con este mismo nombre en el curso indicado.");
          throw new AppException(
            ErrorType.INVALID_ARGUMENTS_ERROR,
            error.message
          );
        }
        throw new AppException(ErrorType.GENERAL_ERROR, error.message);
      }
      throw error;
    }

  }

  public async patch(chapterId: string, courseId: string, values: Partial<Chapter>) {
    try {
      const chapter = await db.chapter.update({
        where: { id: chapterId, courseId },
        data: {
          ...values
        }
      });
      if (!chapter) {
        return null;
      }
      return chapter;
    } catch (error) {
      console.log(error)
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }
  }

  public async reorder(updateData: { id: string, position: number }[]) {
    try {
      console.log(updateData);
      for (let item of updateData) {
        await db.chapter.update({
          where: { id: item.id },
          data: { position: item.position }
        });
      }
      return "success";
    } catch (error) {
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }
  }

  public async findPublisedByCourseId(courseId: string, isPublished: boolean) {
    try {
      const chapters = await db.chapter.findMany({
        where: {
          courseId: courseId,
          isPublished: isPublished
        },
      });
      if (!chapters.length) {
        return null;
      }
      return chapters;
    } catch (error) {
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }
  }

  public async delete(chapterId: string) {
    try {
      const chapter = await db.chapter.delete({
        where: { id: chapterId },
      });
      if (!chapter) {
        return null;
      }
      return chapter;
    } catch (error) {
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }
  }
}

export class MuxService {
  constructor() { }

  public async create(chapterId: string, assetId: string, playbackId?: string) {
    try {
      const asset = await db.muxData.create({
        data: {
          chapterId,
          assetId,
          playbackId
        }
      });
      return asset;
    } catch (error) {
      console.error(error);
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }
  }

  public async findFirst(chapterId: string) {
    try {
      const muxData = await db.muxData.findFirst({
        where: {
          chapterId: chapterId,
        }
      });
      if (!muxData) {
        return null;
      }
      return muxData;
    } catch (error) {
      console.error(error);
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }
  }

  public async delete(id: string) {
    try {
      const deletedAsset = db.muxData.delete({ where: { id: id } });
      if (deletedAsset) return deletedAsset;
      return null;
    } catch (error) {
      console.error(error);
      throw new AppException(ErrorType.GENERAL_ERROR, "Error de Servidor");
    }
  }

}


export class UserProgressService {
  constructor() { }

  // returns the number of chapters seen by a user
  public async findCompletedByUser(userId: string, couseId: string): Promise<number> {
    try {
      const chaptersService = ServiceFactory.getInstance("Chapters") as ChapterService;
      const publishedChapters = await chaptersService.findPublisedByCourseId(couseId, true);
      const publishedChapterIds = publishedChapters?.map((chapter) => chapter.id);
      if (publishedChapterIds && publishedChapterIds.length > 0) {
        const validCompletedChapters = await db.userProgress.count({
          where: {
            userId: userId,
            chapterId: {
              in: publishedChapterIds,
            },
            isCompleted: true,
          }
        });
        const percentageCompleted = (validCompletedChapters / publishedChapterIds?.length) * 100;
        return percentageCompleted;
      }
      return 0;
    } catch (error) {
      console.error("[GET_PROGRESS]", error);
      return 0;
    }
  }

}