import { useUpdateInvoiceMutation } from "@/redux/api/AdminApi"
import type { ErrorResponse } from "@/utils/types/error.types";
import type { InvoiceInputParams } from "@/utils/types/invoice.types";
import toast from "react-hot-toast";


const useUpdateInvoice = (setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    const [updateInvoice, { isLoading: isInvoiceUpdating }] = useUpdateInvoiceMutation();
    const handleUpdateInvoice = async (data: Partial<InvoiceInputParams>) => {
        const newErrors: Partial<Record<keyof InvoiceInputParams, string>> = {};
        try {
            const response = await updateInvoice(data).unwrap();
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
        handleUpdateInvoice,
        isInvoiceUpdating,
        setIsFormOpen
    };
};


export default useUpdateInvoice