import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { setCredentials } from "../features/auth/authSlice";
import { useState } from "react";
import { useRegisterMutation } from "../features/auth/authApiSlice";

export const Register = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<IForm>({
        username: "",
        password: "",
        firstName: "",
        lastName: ""
    });
    const [register] = useRegisterMutation();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const result = await register({
                username: formData.username,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName
            }).unwrap();
            dispatch(setCredentials({user: result.user, accessToken: result.accessToken}));
            navigate("/");
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log(error);
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
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
            Sign up
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 3 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                value={formData.firstName}
                                onChange={(e) => setFormData(prevData => ({...prevData, [e.target.name]: e.target.value}))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                                value={formData.lastName}
                                onChange={(e) => setFormData(prevData => ({...prevData, [e.target.name]: e.target.value}))}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Username"
                                name="username"
                                autoComplete="username"
                                value={formData.username}
                                onChange={(e) => setFormData(prevData => ({...prevData, [e.target.name]: e.target.value}))}

                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={(e) => setFormData(prevData => ({...prevData, [e.target.name]: e.target.value}))}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
              Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Box component={Link} to="/login">
                  Already have an account? Sign in
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
