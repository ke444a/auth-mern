import { useSelector } from "react-redux";
import { selectToken } from "../../features/auth/authSlice";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
    const accessToken = useSelector(selectToken);

    return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;