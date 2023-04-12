import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import BasicTabs from "../components/Tabs";
import { useEffect, useState } from "react";
import { newRequest } from "../services/newRequest";
import { deepPurple } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { ApiStatus } from "../Enums/ApiStatus";
import { getCurrentUserID, isAuthenticated } from "../utils/Auth";
import LoginForm from "../components/LoginForm";
import MySignupForm from "../components/SignupFom";

const Home = () => {
  const navigate = useNavigate();
  const [recommedUsers, setRecommedUsers] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    newRequest("/user/verified/all")
      .then((res) => {
        console.log(res);
        setRecommedUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <br />
      <div className="flex divide-x">
        <div className="flex-1">
          <BasicTabs />
        </div>
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            maxWidth: 360,
            minWidth: 350,
            padding: 2,
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 45,
            }}
          >
            {isAuthenticated() ? (
              <>
                <Typography variant="h6">Recommended topics</Typography>
                <div className="mt-3 flex flex-wrap gap-4 w-full">
                  <Button
                    sx={{
                      textTransform: "capitalize",
                      bgcolor: "#f2f2f2",
                      borderRadius: 100,
                      paddingX: 3,
                    }}
                  >
                    Programming
                  </Button>
                  <Button
                    sx={{
                      textTransform: "capitalize",
                      bgcolor: "#f2f2f2",
                      borderRadius: 100,
                      paddingX: 3,
                    }}
                  >
                    Data Science
                  </Button>
                  <Button
                    sx={{
                      textTransform: "capitalize",
                      bgcolor: "#f2f2f2",
                      borderRadius: 100,
                      paddingX: 3,
                    }}
                  >
                    Moon
                  </Button>
                  <Button
                    sx={{
                      textTransform: "capitalize",
                      bgcolor: "#f2f2f2",
                      borderRadius: 100,
                      paddingX: 3,
                    }}
                  >
                    Drawing
                  </Button>
                  <Button
                    sx={{
                      textTransform: "capitalize",
                      bgcolor: "#f2f2f2",
                      borderRadius: 100,
                      paddingX: 3,
                    }}
                  >
                    Game
                  </Button>
                  <Button
                    sx={{
                      textTransform: "capitalize",
                      bgcolor: "#f2f2f2",
                      borderRadius: 100,
                      paddingX: 3,
                    }}
                  >
                    Shopping
                  </Button>
                </div>
                <br />
                <Typography variant="h6">Who to follow</Typography>
                <List>
                  {recommedUsers?.map((user) => {
                    return (
                      <ListItem key={user?._id}>
                        <div
                          className="cursor-pointer flex items-center w-full"
                          onClick={() => navigate(`/user/${user?._id}`)}
                        >
                          <ListItemAvatar>
                            <Avatar
                              alt={user?.username}
                              src={user?.profileImg}
                              sx={{ bgcolor: deepPurple[500] }}
                            >
                              {user?.username?.slice(0, 1)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={user?.username}
                            secondary={
                              user?.email?.length > 16
                                ? user?.email?.slice(0, 16) + "..."
                                : user?.email
                            }
                          />
                        </div>
                        <div>
                          {user?.followers?.includes(getCurrentUserID()) ? (
                            <Button
                              variant="outlined"
                              sx={{ boxShadow: 0, fontSize: 11 }}
                            >
                              unFollow
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              sx={{ boxShadow: 0, fontSize: 11 }}
                            >
                              Follow
                            </Button>
                          )}
                        </div>
                      </ListItem>
                    );
                  })}
                </List>
              </>
            ) : showLogin ? (
              <LoginForm
                close={() => {}}
                setShowLogin={setShowLogin}
              ></LoginForm>
            ) : (
              <MySignupForm
                close={() => {}}
                setShowLogin={setShowLogin}
              ></MySignupForm>
            )}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Home;
