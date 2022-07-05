const express = require("express");
const router = express.Router();
const authorController = require("../controller/authorController");
const blogController = require("../Controller/blogcontroller");
const authMiddleware = require("../middleware/auth");



router.post("/authors", authorController.createAuthor);
router.post("/login", authorController.loginAuthor);
router.post("/blogs", authMiddleware.authenticate, blogController.createBlog);
router.get("/blogs", authMiddleware.authenticate, blogController.getBlog);
router.put(
  "/blogs/:blogId",
  authMiddleware.authenticate,
 
  blogController.updateBlog
);
router.delete(
  "/blogs/:blogId",
  authMiddleware.authenticate,
  
  blogController.deleteById
);
router.delete(
  "/blogs",authMiddleware.authenticate,blogController.deleteByQuery
);

module.exports = router;
