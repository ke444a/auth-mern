import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link } from "react-router-dom";

const pages = ["Home", "Admin", "Logout"];
const links = ["/", "/admin", "/logout"];

export const Navbar = () => {
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <LockOutlinedIcon
                        sx={{ display: "flex", mr: 1 }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: "flex",
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
              AUTH
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: "flex" }}>
                        {pages.map((page, index) => (
                            <Box
                                key={page}
                                component={Link}
                                to={links[index]}
                                sx={{ my: 2, color: "white", display: "block", mr: 3 }}
                            >
                                {page}
                            </Box>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
