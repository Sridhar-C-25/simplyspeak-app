import { Avatar, Box, Typography } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import moment from "moment/moment";
import parse, { domToReact } from "html-react-parser";
import { useNavigate } from "react-router-dom";

const Blog = ({ post }) => {
  console.log(post);
  const navigate = useNavigate();
  const html = post?.content ? post?.content : "";
  const options = {
    replace: ({ attribs, name, children }) => {
      if (name == "p" && children?.filter((c) => c.data)?.length) {
        return (
          <p className="leading-7 md:max-w-[50vw] max-w-[60vw] truncate	 text-gray-600">
            {domToReact(children)}
          </p>
        );
      } else {
        return <></>;
      }
    },
  };
  const reactElement = parse(html, options);
  return (
    <Box
      key={post?._id}
      onClick={() => navigate("/blog/" + post?._id)}
      sx={{
        maxWidth: 600,
        borderBottom: "1px solid lightgray",
        paddingY: 3,
        cursor: "pointer",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Avatar
          alt={post?.author?.username}
          src={post?.author?.profileImg}
          sx={{ bgcolor: deepPurple[500] }}
        >
          {post?.author?.username?.slice(0, 1)}
        </Avatar>
        <Typography variant="subtitle2">{post?.author?.username}</Typography>
        <p className="text-gray-600 text-sm">
          · {moment(post?.createdAt).fromNow()}
        </p>
      </Box>
      <div className="mt-5">
        <h2 className="sm:text-2xl text-lg mb-2 capitalize font-semibold">
          {post?.title}
        </h2>
        <div className="">
          {reactElement?.length &&
            (reactElement?.filter((ele) => ele?.type == "p")[0] ? (
              reactElement?.filter((ele) => ele?.type == "p").slice(0, 2)
            ) : (
              <p className="leading-7 mt-2 text-gray-600">
                {post?.keywords?.map(
                  (word) =>
                    word && (
                      <span className="border-x inline-block px-2">{word}</span>
                    )
                )}
              </p>
            ))}
        </div>
      </div>
    </Box>
  );
};

export default Blog;
