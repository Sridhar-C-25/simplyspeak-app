const apiStatus = require("../Enums/apiStatus");
const { Blog } = require("../models/blog.model");
const { User } = require("../models/user.model");
const { tranEmailApi, sender } = require("../utils/email");
const ImageUpload = require("../utils/imageUpload");

// * get all blogs
const getBlog = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).populate({
      path: "author",
      select: "-password -verify -vcode",
    });
    const filteredBlogs = blogs.filter((blog) => blog.author !== null);
    return res.status(200).json({ blogs: filteredBlogs });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// * get blogs by Id
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params?.blogId)
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "-password -verify -vcode",
        },
      })
      .populate({
        path: "author",
        select: "-password -verify -vcode",
      })
      .exec();

    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found", status: apiStatus.failure });
    }
    return res.status(200).json({ blog });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

async function sendPostNotificationMail(data, userInfo, postInfo) {
  const receivers = data;
  try {
    const response = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: `${userInfo?.username} added new post`,
      textContent: `
       New Post from ${userInfo?.username}
       `,
      htmlContent: `<h5>${postInfo?.content}</h5>`,
      params: {
        role: "Frontend",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    return {
      message: "Email not send",
      status: apiStatus.failure,
    };
  }
}

// * create a new blog
const createBlog = async (req, res, next) => {
  try {
    var body = req.body;
    if (body.pic) {
      try {
        const url = await ImageUpload(body.pic);
        console.log(`Image uploaded: ${url}`);
        body.pic = url;
      } catch (error) {
        console.error(`Error uploading image: ${error}`);
        body.pic = "";
      }
    }

    const newBlog = new Blog({
      author: req.userId,
      ...body,
    });

    await newBlog.validate().then(
      () => null,
      (err) => {
        return res.status(400).json({
          message: err.message,
          status: apiStatus.failure,
        });
      }
    );
    await newBlog.save();

    const authorInfo = await User.findById(newBlog.author);
    const bcc = await Promise.all(
      authorInfo.emailSubscription.map(async (userId) => {
        const user = await User.findById(userId);
        return { email: user.email };
      })
    );
    if (bcc.length) {
      try {
        const email = await sendPostNotificationMail(bcc, authorInfo, newBlog);
        console.log(email);
      } catch (error) {
        console.log(email);
      }
    }
    return res.status(201).json({ data: newBlog });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// * delete a blog
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
        status: apiStatus.failure,
      });
    }
    if (blog.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this blog",
        status: apiStatus.failure,
      });
    }
    await Blog.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Blog deleted successfully",
      status: apiStatus.success,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//* edit blog
const editBlog = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const updatedBlog = req.body;

    // check if the blog post with the given ID exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // check if the user making the request is the author of the blog post
    if (blog.author.toString() !== req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // update the blog post
    const updated = await Blog.findByIdAndUpdate(blogId, updatedBlog, {
      new: true,
    });

    return res.status(200).json({ data: updated });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//* add comment to a blog
const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    const newComment = { content, userId: req.userId };
    blog.comments.push(newComment);
    await blog.save();
    return res.status(200).json({ comment: newComment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//* delete comment from a blog
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Blog.findOne({
      "comments._id": req.params.commentId,
    }).exec();
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
        status: apiStatus.failure,
      });
    }
    const index = comment.comments.findIndex(
      (comment) => comment._id == req.params.commentId
    );
    if (comment.comments[index].userId != req.userId) {
      return res.status(403).json({
        message: "Unauthorized",
        status: apiStatus.failure,
      });
    }
    comment.comments.splice(index, 1);
    await comment.save();
    return res.status(200).json({
      message: "Comment deleted successfully",
      status: apiStatus.success,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * Get all blogs of a specific author
 *
 * GET /blogs/:authorId
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - JSON response containing the author's blogs
 */
const getAuthorBlogs = async (req, res, next) => {
  try {
    const authorId = req.params.authorId;
    const blogs = await Blog.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "-password -verify -vcode",
        populate: [
          {
            path: "followers",
            select: "-password -verify -vcode",
          },
          {
            path: "following",
            select: "-password -verify -vcode",
          },
        ],
      })

      // .populate("comments.author", "username email")
      // .populate("likes", "username email")
      .exec();

    return res.status(200).json({ blogs });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const followedUserBlogs = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.userId);
    const following = currentUser.following;
    const blogs = await Blog.find({ author: { $in: following } })
      .populate("author", "username")
      .sort({ createdAt: -1 });
    return res.status(200).json({ status: apiStatus.success, data: blogs });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = {
  getBlog,
  createBlog,
  deleteBlog,
  editBlog,
  addComment,
  deleteComment,
  getAuthorBlogs,
  getBlogById,
  followedUserBlogs,
};
