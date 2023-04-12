import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import Container from "@mui/material/Container";
import Slide from "@mui/material/Slide";
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import MySignupForm from "../components/SignupFom";
import { isAuthenticated, logout } from "../utils/Auth";
import { emitter } from "../middleware/Emitter";

function Navbar(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

Navbar.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default function HideNavbar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openAuthForm, setOpenAuthForm] = React.useState(false);

  // auth form popup controller
  const handleClickOpenAuthForm = () => {
    setOpenAuthForm(true);
  };
  const handleClickCloseAuthForm = () => {
    setOpenAuthForm(false);
  };

  const [showLogin, setShowLogin] = React.useState(true);

  const AuthPopup = ({ title }) => {
    return (
      <Dialog
        open={openAuthForm}
        // onClose={handleClose}
        className="min-w-[200px]"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          {showLogin ? (
            <LoginForm
              close={handleClickCloseAuthForm}
              setShowLogin={setShowLogin}
            ></LoginForm>
          ) : (
            <MySignupForm
              close={handleClickCloseAuthForm}
              setShowLogin={setShowLogin}
            ></MySignupForm>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AuthPopup title={"Sign in"} />
      <Navbar {...props}>
        <AppBar
          elevation={0}
          style={{
            background: "white",
            borderBottom: "1px solid #ccc",
            color: "#555",
          }}
        >
          <Container>
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Link to="/" className="flex gap-2 items-center">
                <Avatar
                  src="data:image/png;base64,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"
                  alt=".."
                ></Avatar>
                <h4 className="font-semibold text-lg">Simply Speak</h4>
              </Link>
              <div className="flex items-center gap-4">
                <Link to={"/new-story"} className="flex items-center gap-1">
                  <CreateOutlinedIcon fontSize="10px" />
                  <p>Write</p>
                </Link>
                {isAuthenticated() == false && (
                  <button onClick={handleClickOpenAuthForm}>sign in</button>
                )}
                {/* <Avatar
                src="https://media.istockphoto.com/id/1368424494/photo/studio-portrait-of-a-cheerful-woman.jpg?s=170667a&w=0&k=20&c=nssFUeuHYKJB-ZBTU3LUJlD4m2lvpQ5e7dshUto3FDw="
                alt=".."
              ></Avatar> */}
                {isAuthenticated() && (
                  <>
                    <IconButton
                      onClick={handleClick}
                      size="small"
                      aria-controls={open ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                    >
                      <Avatar
                        src="https://media.istockphoto.com/id/1368424494/photo/studio-portrait-of-a-cheerful-woman.jpg?s=170667a&w=0&k=20&c=nssFUeuHYKJB-ZBTU3LUJlD4m2lvpQ5e7dshUto3FDw="
                        alt=".."
                        sx={{ width: 36, height: 36 }}
                      ></Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      PaperProps={{
                        elevation: 3,

                        sx: {
                          overflow: "visible",
                          mt: 1.5,
                          minWidth: 150,
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <MenuItem onClick={handleClose}>Profile</MenuItem>
                      <MenuItem onClick={handleClose}>My account</MenuItem>
                      <Divider />

                      <MenuItem
                        onClick={() => {
                          handleClose();
                          logout();
                        }}
                      >
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </div>
            </Toolbar>
          </Container>
        </AppBar>
      </Navbar>
      <Toolbar />
    </React.Fragment>
  );
}
