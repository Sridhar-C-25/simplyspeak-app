const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema({
  content: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const arrayMinLength = (val) => {
  return val.length >= 1;
};

const blogSchema = new Schema(
  {
    pic: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [CommentSchema],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    keywords: {
      type: [
        {
          type: String,
          minlength: 1,
        },
      ],
      required: true,
      validate: {
        validator: arrayMinLength,
        message: "Keywords array must contain at least one keyword",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = { Blog };
