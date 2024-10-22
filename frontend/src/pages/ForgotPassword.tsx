import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useState } from "react";
import { useSendResetPasswordEmailMutation } from "../features/auth/authApiSlice";

const ForgotPassword = () => {
    const [emailToReset, setEmailToReset] = useState<string>("");
    const [sendResetPasswordEmail] = useSendResetPasswordEmailMutation();
    const [emailLink, setEmailLink] = useState<string>("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = await sendResetPasswordEmail(emailToReset).unwrap();
        if (!result.isError) {
            setEmailLink(result.message);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginY: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <InputLabel>
              Enter the email for the account you forgot the password for:
                    </InputLabel>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={emailToReset}
                        onChange={(e) => setEmailToReset(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
              Send Reset Link
                    </Button>
                </Box>
            </Box>
            {emailLink && (
                <Typography variant="h5">
                    <Link href={emailLink}>View the email</Link>
                </Typography>
            )}
        </Container>
    );
};

export default ForgotPassword;
