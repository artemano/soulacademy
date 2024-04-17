import { auth } from "@/auth";
import { ServiceFactory } from "@/lib/service.factory";
import { CourseService } from "@/services/courses";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user.username;
    const title = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseService = ServiceFactory.getInstance("Courses") as CourseService;
    const course = await courseService.create(userId, title);
    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user.username;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseService = ServiceFactory.getInstance("Courses") as CourseService;
    const course = await courseService.findManyByUser(userId);
    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
