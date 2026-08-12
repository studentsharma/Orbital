import Router from "express";
import {createPost, editPost, deletePost, commentPost, likePost, dislikePost, getPosts} from "../controllers/post.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import multer from "multer";
import uploadImage from "../imagekit/imagekitControl.js";

const router = Router();
router.use(authenticate);
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});


router.post("/create-post",upload.single("image"), createPost);
router.post("/edit-post", editPost);
router.delete("/delete-post", deletePost);

router.post("/post-comment", commentPost);
router.post("/post-like", likePost);
router.post("/post-dislike", dislikePost);

router.post("/get-posts", getPosts);


export default router;