import { useSelector } from "react-redux";
import { selectToken } from "../../features/auth/authSlice";
import { Outlet, useLocation, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
    const accessToken = useSelector(selectToken);
    const location = useLocation();

    return accessToken ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;