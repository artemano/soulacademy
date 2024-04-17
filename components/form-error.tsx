
import { BsExclamationTriangle } from "react-icons/bs"
type Props = {
    message?: string;
}

function FormError({ message }: Props) {
    if (!message) return null;
    return (
        <div className="bg-destructive/20 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
            <BsExclamationTriangle className="w-4 h-4" />
            <p>{message}</p>
        </div>
    )
}

export default FormError