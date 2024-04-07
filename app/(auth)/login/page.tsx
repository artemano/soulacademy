import React from "react";
import { LoginForm } from "../_components/LoginForm";

type LoginCallbackData = {
  callbackUrl: string;
  userId?: string;
  error?: string;
  slug?: string;
  courseId?: string;
};

interface LoginProps {
  searchParams?: LoginCallbackData;
}

export default function LoginPage({ searchParams }: LoginProps) {
  //console.log(searchParams);
  const getStringFromSearchParams = (params: LoginCallbackData) => {
    let ret = "";
    if (params?.callbackUrl) {
      ret = ret + params.callbackUrl;
    }
    if (params?.userId) {
      ret = ret + `&email=${params.userId}`;
    }
    if (params.slug) {
      ret = ret + `&slug=${params.slug}`;
    } else if (params.courseId) {
      ret = ret + `&courseId=${params.courseId}`;
    }
    //console.log(ret);
    return ret;
  };
  const callbackString = getStringFromSearchParams(searchParams!);
  return (
    <div>
      <LoginForm
        error={searchParams?.error}
        callbackUrl={callbackString}
        className="flex flex-col-1 items-center justify-center"
      />
    </div>
  );
}
