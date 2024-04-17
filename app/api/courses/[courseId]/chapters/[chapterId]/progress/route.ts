//import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const session = await auth();
        const userId = session?.user.username;
        const { isCompleted } = await req.json();

        if (!userId) {
            return new NextResponse("No autorizado", { status: 401 });
        }

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: params.chapterId,
                }
            },
            update: {
                isCompleted
            },
            create: {
                userId,
                chapterId: params.chapterId,
                isCompleted,
            }
        })

        return NextResponse.json(userProgress);
    } catch (error) {
        console.error("[CHAPTER_ID_PROGRESS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}