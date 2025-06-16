import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormErrorProps {
    message?: string;
}

export const FormError = ({ message,  }: FormErrorProps) => {
    if(!message) {
        return null;
    }

    return (
        <div className="bg-destructive/15 text-destructive flex items-center gap-x-2 rounded-md text-sm p-2">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <span className="text-sm">{message}</span>
        </div>
    )
}