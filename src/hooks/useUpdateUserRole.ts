import { useUpdateUserRoleMutation } from "@/redux/api/AdminApi"
import type { ErrorResponse } from "@/utils/types/error.types";
import toast from "react-hot-toast";
interface UpdateUserType {
    userId: string,
    role: string
}
const useUpdateUserRole = () => {
    const [updateUserRole, { isLoading: isUpdateUserRoleLoading }] = useUpdateUserRoleMutation();
    const updateUser = async ({ userId, role }: UpdateUserType) => {
        try {
            const response = await updateUserRole({ userId, role }).unwrap();
            toast.success(response.message);
        } catch (error) {
            const err = error as ErrorResponse;
            if (err.data?.message) {
                toast.error(err.data.message);
            }

        }
    }
    return {
        updateUser,
        isUpdateUserRoleLoading
    }
}
export default useUpdateUserRole