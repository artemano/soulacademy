import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request, response: Response) {
  const secretKey = process.env.RECAPTCHA_SECRET_KET;

  const postData = await req.json();
  const { gRecaptchaToken } = postData;
  let res;
  const formData = `secret=${secretKey}&response=${gRecaptchaToken}`;
  try {
    res = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (res && res.data?.success && res.data?.score > 0.5) {
      return NextResponse.json({
        success: true,
        score: res.data?.score,
      });
    }
    return NextResponse.json({ success: false });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}
