import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useLogoutQuery } from "../features/auth/authApiSlice";
import { Link } from "react-router-dom";

const Logout = () => {
    const {isSuccess} = useLogoutQuery();

    if (!isSuccess) {
        return null;
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: "20px", marginTop: "50px", textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>
                    You've successfully logged out
                </Typography>
                <Link to="/login">Back to Login page</Link>
            </Paper>
        </Container>
    );
};

export default Logout;