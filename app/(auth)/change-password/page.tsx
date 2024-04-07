import { ChangeForm } from "../_components/ChangeForm";


type CallbackData = {
    callbackUrl: string;
    error?: string;
    slug?: string;
    courseId?: string;
};

interface ChangeFormProps {
    searchParams?: CallbackData;
}

export default function ChangeFormPage({ searchParams }: ChangeFormProps) {
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
        console.log(ret);
        return ret;
    };
    const callbackString = getStringFromSearchParams(searchParams!);
    return (
        <div>
            <ChangeForm
                error={searchParams?.error}
                callbackUrl={callbackString}
                className="flex flex-col-1 items-center justify-center"
            />
        </div>
    );
}