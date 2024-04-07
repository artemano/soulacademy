import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import authOptions from "../../auth/[...nextauth]/options";

const apiEndpoint = process.env.NEXT_PUBLIC_STRAPI_API_URL;

export async function GET(request: NextRequest) {
  try {
    const user = await getServerSession(authOptions);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No autorizado" },
        { status: 401 }
      );
    }
    const endPoint = `${apiEndpoint}/api/users/me?populate=role`;
    const token = user.user.token;
    console.log(token);
    const settings = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    };
    const res = await fetch(endPoint, settings);
    const meResponse = await res.json();
    if (meResponse.error) {
      console.error(meResponse.error);
      return NextResponse.json(
        { success: false, message: meResponse.error.message },
        { status: meResponse.status || 503 }
      );
    }
    console.log(meResponse);
    return NextResponse.json(
      { success: true, user: meResponse },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("User Me", e);
    return NextResponse.json(
      { message: "Error obteniendo datos del usuario", e },
      { status: 500 }
    );
  }
}