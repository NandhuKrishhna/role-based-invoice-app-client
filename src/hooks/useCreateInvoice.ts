import { useCreateInvoiceMutation } from "@/redux/api/AdminApi"
import type { ErrorResponse } from "@/utils/types/error.types";
import type { InvoiceInputParams } from "@/utils/types/invoice.types";
import toast from "react-hot-toast";


const useCreateInvoice = (setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    const [createInvoice, { isLoading: isInvoiceCreating }] = useCreateInvoiceMutation();
    const handleCreateInvoice = async (data: InvoiceInputParams) => {
        const newErrors: Partial<Record<keyof InvoiceInputParams, string>> = {};
        try {
            const response = await createInvoice(data).unwrap();
            toast.success(response.message);
            setIsFormOpen(false)
        } catch (error) {
            const err = error as ErrorResponse;

            if (err.data?.message === "Validation error") {
                console.log(err)
                err.data.errors?.map((error) => {
                    newErrors[error.path as keyof InvoiceInputParams] = error.message;
                });
                return newErrors
            } else {
                if (err.data?.message) {
                    toast.error(err.data.message);
                }
            }


        }

    };


    return {
        handleCreateInvoice,
        isInvoiceCreating,
    };
};


export default useCreateInvoice