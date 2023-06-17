import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import { Navbar } from "../components/ui/Navbar";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const Home = () => {
    const user = useSelector(selectUser);

    return (
        <>
            <Navbar />
            <Container>
                <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
                    <Typography variant="h2" gutterBottom>
              Welcome, {user?.firstName + " " + user?.lastName}
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary={`Email: ${user?.email}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`First Name: ${user?.firstName}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`Last Name: ${user?.lastName}`} />
                        </ListItem>
                    </List>
                </Paper>
            </Container>
        </>
    );
};

export default Home;
