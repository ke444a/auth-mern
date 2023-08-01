import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";

const Login = () => {
    const [formData, setFormData] = useState<IForm>({
        email: "",
        password: ""
    });
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [login] = useLoginMutation();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = await login(formData).unwrap();
        dispatch(setCredentials({ user: result.user, accessToken: result.accessToken }));
        navigate("/");
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
            Login
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formData.email}
                        onChange={(e) => setFormData(prevData => ({...prevData, [e.target.name]: e.target.value}))}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={(e) => setFormData(prevData => ({...prevData, [e.target.name]: e.target.value}))}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
              Login
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Box component={Link} to="/forgot-password">
                  Forgot password?
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box component={Link} to="/register">
                                {"Don't have an account? Sign Up"}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
