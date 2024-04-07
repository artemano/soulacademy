//import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
//import authOptions from "../../auth/[...nextauth]/options";
import { auth } from "@/actions/auth";

const apiEndpoint = process.env.NEXT_PUBLIC_STRAPI_API_URL;

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json();
        //const user = await getServerSession(authOptions);
        const { sessionToken } = await auth();
        //const sessionToken = user?.user.token;
        const { currentPassword, password, passwordConfirmation } = body;
        //console.log(currentPassword, password, passwordConfirmation)
        const endPoint = `${apiEndpoint}/api/auth/change-password`;
        const settings = {
            method: "POST",
            body: JSON.stringify({ currentPassword, password, passwordConfirmation }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionToken}`
            },
        };
        const res = await fetch(endPoint, settings);
        const changePasswordResponse = await res.json();
        //console.log(changePasswordResponse);
        if (changePasswordResponse.error) {
            //console.log(changePasswordResponse.error);
            return NextResponse.json(
                { success: false, message: changePasswordResponse.error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: true },
            { status: 201 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 400, message: "Error en la petición" });
    }

}