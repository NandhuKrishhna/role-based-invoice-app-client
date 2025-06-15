
import { selectCurrentToken, selectCurrentUser } from "@/redux/slice/authSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type RequireAuthProps = {
  allowedRoles: string[];
  redirectTo: string;
};

const RequireAuth = ({ allowedRoles, redirectTo }: RequireAuthProps) => {
  const location = useLocation();
  const token = useSelector(selectCurrentToken);
  const authUser = useSelector(selectCurrentUser);
  if (!token) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(authUser?.role ?? "")) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Outlet />;
};



export default RequireAuth;
