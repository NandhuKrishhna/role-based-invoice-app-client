import type { CreateAdminData } from "@/Components/add-admin-modal";
import { useCreateAdminMutation } from "@/redux/api/AdminApi"
import type { ErrorResponse } from "@/utils/types/error.types";
import type { CreateAdminType } from "@/utils/types/super-admins.types";
import { useState } from "react";
import toast from "react-hot-toast";


const useAddUser = () => {
    const [createAdmin, { isLoading: isUserCreating }] = useCreateAdminMutation();
    const [addAdminModal, setAddAdminModal] = useState(false)
    const handleCreateAdmin = async (data: CreateAdminType) => {
        const newErrors: Partial<Record<keyof CreateAdminData, string>> = {};
        try {
            const response = await createAdmin(data).unwrap();
            toast.success(response.message);
            setAddAdminModal(false)
        } catch (error) {
            const err = error as ErrorResponse;

            if (err.data?.message === "Validation error") {
                console.log(err)
                err.data.errors?.map((error) => {
                    newErrors[error.path as keyof CreateAdminData] = error.message;
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
        handleCreateAdmin,
        isUserCreating,
        addAdminModal,
        setAddAdminModal
    };
};


export default useAddUser