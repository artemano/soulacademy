import { RegisterForm } from "../_components/RegisterForm";

type LoginCallbackData = {
  callbackUrl: string;
  error?: string;
  slug?: string;
  courseId?: string;
};

interface LoginProps {
  searchParams?: LoginCallbackData;
}

export default function RegisterPage({ searchParams }: LoginProps) {
  //console.log(searchParams);
  const getStringFromSearchParams = (params: LoginCallbackData) => {
    let ret = "";
    if (params?.callbackUrl) {
      ret = ret + params.callbackUrl;
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
      <RegisterForm
        error={searchParams?.error}
        callbackUrl={callbackString}
      />
    </div>
  );
}
