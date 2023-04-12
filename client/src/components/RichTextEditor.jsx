import React, { useEffect, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageUploader from "quill-image-uploader";
import ImageResize from "quill-image-resize-module-react";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

Quill.register("modules/imageUploader", ImageUploader);
Quill.register("modules/imageResize", ImageResize);

const RichTextEditor = ({ value, setValue }) => {
  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <>
      <div>
        <ReactQuill
          modules={{
            syntax: true,
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline"],
              ["blockquote", "code-block"],
              [
                { align: "" },
                { align: "center" },
                { align: "right" },
                { align: "justify" },
              ],
              [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }],
              [{ color: [] }, { background: [] }],
              ["link", "image", "video"],
              ["clean"],
            ],
            imageResize: {
              parchment: Quill.import("parchment"),
              modules: ["Resize", "DisplaySize"],
            },
          }}
          theme="snow"
          value={value}
          onChange={setValue}
        />
      </div>
    </>
  );
};

export default RichTextEditor;
