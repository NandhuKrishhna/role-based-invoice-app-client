import { useLoginMutation } from "@/redux/api/AdminApi";
import { setCredentials } from "@/redux/slice/authSlice";
import type { LoginData } from "@/utils/types/error.types";
import toast from "react-hot-toast";
import type { ErrorResponse } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const useLoginHook = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const handleLogin = async (data: LoginData) => {
        try {
            const response = await login(data).unwrap();
            toast.success(response.message);
            const userData = response.response;
            dispatch(setCredentials(userData));
            const redirectPath = userData.role === "SUPER_ADMIN" ? "/dashboard" : "/invoice";
            console.log("Navigating to:", redirectPath);
            navigate(redirectPath);

        } catch (error) {
            const err = error as ErrorResponse;
            if (err.data?.message) {
                toast.error(err.data.message);
            }
        }
    }

    return {
        handleLogin,
        isLoginLoading
    }
}

export default useLoginHook