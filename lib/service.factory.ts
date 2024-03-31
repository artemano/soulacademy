import {
  AttachmentService,
  CategoryService,
  ChapterService,
  CourseService,
  MuxService,
  UserProgressService,
} from "@/services/courses";

export class ServiceFactory {
  private static courses: CourseService;
  private static categories: CategoryService;
  private static attachments: AttachmentService;
  private static chapters: ChapterService;
  private static muxData: MuxService;
  private static userProgress: UserProgressService;

  constructor() { }

  static getInstance(serviceName: "Courses" | "Category" | "Attachments" | "Chapters" | "MuxData" | "UserProgress") {
    switch (serviceName) {
      case "Courses":
        if (!ServiceFactory.courses) {
          ServiceFactory.courses = new CourseService();
        }
        return ServiceFactory.courses;
      case "Category":
        if (!ServiceFactory.categories) {
          ServiceFactory.categories = new CategoryService();
        }
        return ServiceFactory.categories;
      case "Attachments":
        if (!ServiceFactory.attachments) {
          ServiceFactory.attachments = new AttachmentService();
        }
        return ServiceFactory.attachments;
      case "Chapters":
        if (!ServiceFactory.chapters) {
          ServiceFactory.chapters = new ChapterService();
        }
        return ServiceFactory.chapters;
      case "MuxData":
        if (!ServiceFactory.muxData) {
          ServiceFactory.muxData = new MuxService();
        }
        return ServiceFactory.muxData;
      case "UserProgress":
        if (!ServiceFactory.userProgress) {
          ServiceFactory.userProgress = new UserProgressService();
        }
        return ServiceFactory.userProgress;
      default:
        return ServiceFactory.courses;
    }
  }
}
