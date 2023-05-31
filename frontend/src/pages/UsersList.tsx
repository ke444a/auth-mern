import { useGetUsersQuery } from "../features/users/usersApiSlice";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { Navbar } from "../components/ui/Navbar";


const UsersList = () => {
    const { data: users, isSuccess} = useGetUsersQuery();
    if (!isSuccess) {
        return null;
    }

    return (
        <>
            <Navbar />
            <Container>
                <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
                    <Typography variant="h2" gutterBottom>
              Users List
                    </Typography>
                    <List>
                        {users.map((user: IUser, index: number) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={`${index+1}: ${user?.firstName} ${user?.lastName}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Container>
        </>
    );
};

export default UsersList;