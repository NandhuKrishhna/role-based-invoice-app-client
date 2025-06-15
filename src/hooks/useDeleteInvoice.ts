import { useDeleteInvoiceMutation } from "@/redux/api/AdminApi";
import type { ErrorResponse } from "@/utils/types/error.types";
import toast from "react-hot-toast";


const useDeleteInvoice = () => {
    const [deleteInvoice, { isLoading: isInvoiceDeleting }] = useDeleteInvoiceMutation();
    const handleDeleteInvoice = async (invoiceId: string) => {
        console.log(invoiceId)
        try {
            const response = await deleteInvoice(invoiceId).unwrap();
            toast.success(response.message);
        } catch (error) {
            const err = error as ErrorResponse;
            if (err.data?.message) {
                toast.error(err.data.message);
            }
        }

    };


    return {
        handleDeleteInvoice,
        isInvoiceDeleting,
    };
};


export default useDeleteInvoice