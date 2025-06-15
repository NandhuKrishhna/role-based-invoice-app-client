import { selectCurrentUser } from "@/redux/slice/authSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const user = useSelector(selectCurrentUser);
  const token = user?.accessToken;
  const role = user?.role;

  if (token) {
    if (role === "SUPER_ADMIN") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/invoice" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
