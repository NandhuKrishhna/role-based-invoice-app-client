import { selectCurrentUser } from "@/redux/slice/Auth_Slice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const user = useSelector(selectCurrentUser);
  const token = user?.accessToken;
  const role = user?.role;

  if (token) {
    if (role === "doctor") return <Navigate to="/doctor/dashboard" replace />;
    if (role === "admin") return <Navigate to="/admin/users-management" replace />;
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
