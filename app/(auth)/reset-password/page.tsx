import { ResetForm } from "../_components/ResetForm";

type CallbackData = {
    callbackUrl: string;
    error?: string;
    slug?: string;
    courseId?: string;
    code?: string;
};

interface ResetProps {
    searchParams?: CallbackData;
}

export default function ResetPage({ searchParams }: ResetProps) {
    //console.log(searchParams?.code);
    const getStringFromSearchParams = (params: CallbackData) => {
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
            <ResetForm
                error={searchParams?.error}
                code={searchParams?.code}
                callbackUrl={callbackString}
                className="flex flex-col-1 items-center justify-center"
            />
        </div>
    );
}