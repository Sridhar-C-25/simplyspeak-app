const {
  createBlog,
  getBlog,
  deleteBlog,
  editBlog,
  addComment,
  deleteComment,
  getAuthorBlogs,
  getBlogById,
  followedUserBlogs,
} = require("../controllers/blog.controller");
const verifyToken = require("../middleware/jwt");

const router = require("express").Router();

router.post("/create", verifyToken, createBlog);
router.get("/", getBlog);
router.delete("/:id", verifyToken, deleteBlog);
router.put("/:id", verifyToken, editBlog);
router.put("/:id/comment", verifyToken, addComment);
router.delete("/:id/comments/:commentId", verifyToken, deleteComment);
router.get("/author/:authorId", getAuthorBlogs);
router.get("/:blogId", getBlogById);
router.get("/user/followed", verifyToken, followedUserBlogs);

module.exports = router;
