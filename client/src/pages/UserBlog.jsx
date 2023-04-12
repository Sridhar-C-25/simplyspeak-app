import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { newRequest } from "../services/newRequest";
import Posts from "../components/Blogs";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Skeleton,
  Typography,
  colors,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
const UserBlog = () => {
  const { authorId } = useParams();
  const [authorBlogs, setAuthorBlogs] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    newRequest("/blog/author/" + authorId)
      .then((res) => {
        console.log(res);
        setLoading(false);
        setAuthorBlogs(res?.data?.blogs);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [authorId]);

  return (
    <div>
      <br />
      <div className="flex divide-x">
        <div className="w-full">
          {authorBlogs?.length ? (
            <Posts data={authorBlogs} />
          ) : loading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <p>Sorry, there are no blogs available for this user.</p>
          )}
        </div>
        {loading ? (
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              maxWidth: 360,
              minWidth: 350,
              minHeight: "80vh",
              padding: 2,
            }}
          >
            <Skeleton variant="circular" width={60} height={60} />
            <br />
            <Skeleton variant="rectangular" width={240} height={60} />
            <br />
            <Skeleton variant="rounded" width={240} height={60} />
          </Box>
        ) : (
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              maxWidth: 360,
              minWidth: 350,
              minHeight: "80vh",
              padding: 2,
            }}
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Avatar
                  alt={authorBlogs && authorBlogs[0]?.author?.username}
                  src={authorBlogs && authorBlogs[0]?.author?.profileImg}
                  sx={{ bgcolor: deepPurple[500], width: 60, height: 60 }}
                >
                  {authorBlogs && authorBlogs[0]?.author?.username?.slice(0, 1)}
                </Avatar>
                <div>
                  <Typography variant="h6">
                    {authorBlogs && authorBlogs[0]?.author?.username}
                  </Typography>
                  <Typography>
                    {authorBlogs && authorBlogs[0]?.author?.email}
                  </Typography>
                </div>
              </div>
              <div className="ml-[70px]">
                <div className="flex items-center gap-3 text-sm">
                  <p>
                    {authorBlogs && authorBlogs[0]?.author?.followers?.length}{" "}
                    Followers
                  </p>
                  <p>
                    {authorBlogs && authorBlogs[0]?.author?.following?.length}{" "}
                    Following
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-4">
                  <Button
                    variant="contained"
                    sx={{ boxShadow: 0, fontSize: 11 }}
                  >
                    Follow
                  </Button>
                  <IconButton
                    sx={{
                      bgcolor: colors.grey[800],
                      color: "white",
                      ":hover": {
                        bgcolor: colors.grey[700],
                      },
                    }}
                  >
                    <MarkEmailUnreadOutlinedIcon></MarkEmailUnreadOutlinedIcon>
                  </IconButton>
                </div>
              </div>
            </div>
          </Box>
        )}
      </div>
    </div>
  );
};

export default UserBlog;
