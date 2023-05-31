import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Home from "./pages/Home";
import { CssBaseline } from "@mui/material";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import UsersList from "./pages/UsersList";

const App = () => {
    const location = useLocation();

    return (
        <>
            <CssBaseline />
            {location.pathname === "/" && <Navigate to="/home" replace />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/logout" element={<Logout />} />
                
                <Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/users" element={<UsersList />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;