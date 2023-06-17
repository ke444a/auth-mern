import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import { useState } from "react";
import { useResetPasswordMutation } from "../features/auth/authApiSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState<string>("");
    const [resetPassword] = useResetPasswordMutation();
    const [searchParams] = useSearchParams();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = await resetPassword({ token: searchParams.get("token"), password: newPassword }).unwrap();
        if (!result.isError) {
            toast.success(result.message);
            navigate("/");
        }    
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
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <InputLabel>
          Enter the new password:
                    </InputLabel>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        name="password"
                        autoComplete="password"
                        type="password"
                        autoFocus
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                    Reset Password
                    </Button>
                </Box>
            </Box>
        </Container>);
};

export default ResetPassword;
