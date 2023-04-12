import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { newRequest } from "../services/newRequest";
import { Avatar, Button, Typography, ListItemAvatar } from "@mui/material";
import moment from "moment";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import SideDrawer from "../components/SideDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import {
  blue,
  deepOrange,
  deepPurple,
  green,
  yellow,
} from "@mui/material/colors";

const Blog = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    newRequest("/blog/" + blogId)
      .then((res) => {
        console.log(res.data?.blog);
        setBlog(res?.data?.blog);
      })
      .catch((err) => console.log(err));
  }, [blogId]);

  const [state, setState] = useState({
    right: false,
  });
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const randomColors = [
    deepOrange[600],
    deepPurple[600],
    green[500],
    green[300],
    blue[400],
    yellow[600],
  ];

  const onLike = () => {
    console.log(blogId);
  };

  return (
    <div className="max-w-4xl mx-auto my-5">
      <SideDrawer toggleDrawer={toggleDrawer} state={state} setState={setState}>
        <List>
          {blog?.comments?.length ? (
            blog?.comments?.map((comment) => {
              return (
                <ListItem key={comment._id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt={comment?.userId?.username}
                      sx={{
                        bgcolor:
                          randomColors[
                            Math.floor(Math.random() * randomColors.length)
                          ],
                      }}
                      src={comment?.userId?.profileImg}
                    >
                      {comment?.userId?.username?.slice(0, 1)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={comment?.userId?.username}
                    secondary={<>{comment?.content}</>}
                  />
                </ListItem>
              );
            })
          ) : (
            <p className="text-center mt-3">Write your first comment</p>
          )}
        </List>
      </SideDrawer>

      <div className="sticky top-[88%] translate-x-[-50%] left-[50%] w-fit mx-auto bg-white shadow-md px-5 py-2 rounded-full text-gray-400 flex items-center gap-2">
        <ChatBubbleOutlineOutlinedIcon
          onClick={toggleDrawer("right", true)}
          className="cursor-pointer"
        ></ChatBubbleOutlineOutlinedIcon>{" "}
        {blog?.comments?.length}
        <ThumbUpOutlinedIcon
          onClick={onLike}
          className="cursor-pointer"
        ></ThumbUpOutlinedIcon>{" "}
        {blog?.likes?.length}
      </div>
      <div className="pb-4 border-b mb-3">
        <div className="flex items-center gap-4">
          <Avatar
            alt={blog && blog?.author?.username}
            src={blog && blog?.author?.profileImg}
            sx={{ bgcolor: deepPurple[500], width: 60, height: 60 }}
          >
            {blog && blog?.author?.username?.slice(0, 1)}
          </Avatar>
          <div>
            <Typography variant="subtitle1">
              {blog?.author?.username}
            </Typography>
            <p className="text-gray-600 text-sm">
              · {moment(blog?.createdAt).fromNow()}
            </p>
          </div>
        </div>
      </div>
      <h3 className="md:text-3xl text-xl font-semibold">{blog?.title}</h3>
      <br />

      <div className="" dangerouslySetInnerHTML={{ __html: blog?.content }} />
      <div className="mt-10 flex flex-wrap items-center gap-2.5">
        {blog?.keywords?.map((keyword) => {
          return (
            <Button
              key={keyword}
              sx={{
                textTransform: "capitalize",
                bgcolor: "#f2f2f2",
                borderRadius: 100,
                paddingX: 3,
              }}
            >
              {keyword}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default Blog;
