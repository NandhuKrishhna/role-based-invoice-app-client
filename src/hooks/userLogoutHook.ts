import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { persistor } from "@/redux/store";
import { useLazyLogoutQuery } from "@/redux/api/AdminApi";
import { setLogout } from "@/redux/slice/authSlice";
import { apiSlice } from "@/redux/api/EntryApi";

export const useLogout = () => {
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLazyLogoutQuery();
  const handleLogout = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      await logout({}).unwrap();

      dispatch(setLogout());
      localStorage.clear();
      dispatch(apiSlice.util.resetApiState());
      await persistor.purge();
      toast.success("Logout Successfull");
    } catch (error) {
      console.log(error);
    }
  };

  return {
    isLoading,
    handleLogout,
  };
};
