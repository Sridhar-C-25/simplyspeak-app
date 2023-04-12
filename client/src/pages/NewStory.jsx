import { TextField, Typography } from "@mui/material";
import RichTextEditor from "../components/RichTextEditor";
import TagsInput from "../components/TagsInput.";
import { newRequest } from "../services/newRequest";
import { useEffect, useState } from "react";
import { ApiStatus } from "../Enums/ApiStatus";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const NewStory = () => {
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Hello World");
  const navigate = useNavigate();

  const onCreateBlog = () => {
    newRequest("/blog/create", {
      method: "POST",
      data: {
        title,
        content,
        keywords: tags,
      },
    })
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          toast.success("Blog Created Successfully");
          navigate("/");
          return;
        }
        toast.error("something went wrong!");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "850px",
        margin: "1rem auto",
      }}
    >
      <Typography variant="h5">New Story</Typography>
      <br />

      <div className="!mb-5">
        <TextField
          required
          id="outlined-required"
          label="Title"
          value={title}
          sx={{ width: "100%" }}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>
      <TagsInput tags={tags} setTags={setTags} />
      <br />
      <RichTextEditor value={content} setValue={setContent}></RichTextEditor>

      <div className="flex justify-end">
        <button
          onClick={onCreateBlog}
          className="!bg-green-600 mt-4 px-4 py-1.5 rounded-full text-white shadow-lg"
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default NewStory;
