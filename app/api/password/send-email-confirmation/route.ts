import { NextRequest, NextResponse } from "next/server";

const apiEndpoint = process.env.NEXT_PUBLIC_STRAPI_API_URL;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { email } = body;
    //console.log(email);
    const endPoint = `${apiEndpoint}/api/auth/send-email-confirmation`;
    const settings = {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(endPoint, settings);
    const recoverResponse = await res.json();
    if (recoverResponse.error) {
      console.error(recoverResponse.error);
      return NextResponse.json(
        { success: false, message: recoverResponse.error.message },
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