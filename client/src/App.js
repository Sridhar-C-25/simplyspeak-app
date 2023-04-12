import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Home from "./pages/Home";
import NewStory from "./pages/NewStory";
import UserBlog from "./pages/UserBlog";
import Blog from "./pages/Blog";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { emitter } from "./middleware/Emitter";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const App = () => {
  const router = useNavigate();

  var token = emitter.addListener("logout", () => {
    console.log("----logout");
  });

  // token.remove();

  return (
    <>
      <ToastContainer />
      <RootLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user/:authorId" element={<UserBlog />} />
          <Route path="/new-story" element={<NewStory />} />
          <Route path="/blog/:blogId" element={<Blog />} />
        </Routes>
      </RootLayout>
    </>
  );
};

export default App;
