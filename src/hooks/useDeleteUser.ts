import { useDeleteUserMutation } from "@/redux/api/AdminApi"
import toast from "react-hot-toast";
import type { ErrorResponse } from "react-router-dom";

const useDeleteUser = () => {
    const [deletedUser, { isLoading: isUserDeleting }] = useDeleteUserMutation()
    const deleteUser = async (userId: string) => {
        try {
            const response = await deletedUser(userId).unwrap();
            toast.success(response.message);
        } catch (error) {
            const err = error as ErrorResponse;
            if (err.data?.message) {
                toast.error(err.data.message);
            }
        }
    }

    return {
        deleteUser,
        isUserDeleting
    }
}


export default useDeleteUser