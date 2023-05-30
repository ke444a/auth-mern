import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const Logout = () => {
    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: "20px", marginTop: "50px" }}>
                <Typography variant="h5" align="center">
            You've successfully logged out
                </Typography>
            </Paper>
        </Container>
    );
};

export default Logout;