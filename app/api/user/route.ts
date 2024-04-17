import { RegisterFormSchema } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";

const apiEndpoint = process.env.NEXT_PUBLIC_STRAPI_API_URL;

export async function POST(request: NextRequest) {
  try {
    const { name, lastname, email, password, accept } =
      await request.json()

    const username = email;
    console.log(username, name, lastname, email, accept);
    const endPoint = `${apiEndpoint}/api/auth/local/register`;

    const settings = {
      method: "POST",
      body: JSON.stringify({ username, name, lastname, email, password }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(endPoint, settings);
    const registerResponse = await res.json();
    if (registerResponse.error) {
      console.error(registerResponse.error);
      return NextResponse.json(
        { success: false, message: registerResponse.error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: true, user: registerResponse },
      { status: 201 }
    );
  } catch (e: any) {
    console.log("User Register", e);
    return NextResponse.json(
      { message: "Error registrando al usuario", e },
      { status: 500 }
    );
  }
}
