import { NextRequest, NextResponse } from "next/server";

const apiEndpoint = process.env.NEXT_PUBLIC_STRAPI_API_URL;
import { RegisterFormSchema as registerSchema } from "@/app/utils/schemas";

export async function POST(request: NextRequest) {
  try {
    const { name, lastname, email, password, accept } = registerSchema.parse(
      await request.json()
    );
    const username = email;
    //console.log(username, name, lastname, email, accept);
    //console.log(apiEndpoint);
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
    console.error("User Register", e);
    return NextResponse.json(
      { message: "Error registrando al usuario", e },
      { status: 500 }
    );
  }
}
