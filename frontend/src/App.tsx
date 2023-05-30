import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Home from "./pages/Home";
import { CssBaseline } from "@mui/material";

const App = () => {
    const location = useLocation();

    return (
        <>
            <CssBaseline />
            {location.pathname === "/" && <Navigate to="/home" />}
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </>
    );
};

export default App;