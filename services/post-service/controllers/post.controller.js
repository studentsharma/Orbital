import mongoose from "mongoose";
import imagekit from "../imagekit/ImageKitConfig.js";
import Post from "../models/post.model.js";

const getPostId = (request) => request.body.postId || request.body.id || request.params.id;

const isValidPostId = (postId) => mongoose.isValidObjectId(postId);

const findOwnedPost = (postId, userId) => {
  if (!isValidPostId(postId)) {
    return null;
  }

  return Post.findOne({ _id: postId, userId });
};

const createPost = async (request, response) => {
  try {
    const { caption = "", authorName } = request.body;

    if (!authorName?.trim()) {
      return response.status(400).json({ message: "authorName is required." });
    }

    if (!caption.trim() && !request.file) {
      return response.status(400).json({ message: "A caption or image is required." });
    }

    const media = [];

    if (request.file) {
      const uploadedImage = await imagekit.upload({
        file: request.file.buffer,
        fileName: request.file.originalname,
        folder: "/orbital/posts",
      });

      media.push({
        url: uploadedImage.url,
        fileId: uploadedImage.fileId,
        type: "image",
      });
    }

    const post = await Post.create({
      userId: request.userId,
      authorName: authorName.trim(),
      caption: caption.trim(),
      media,
    });

    return response.status(201).json({ message: "Post created successfully.", post });
  } catch (error) {
    console.error("Create post error:", error);
    return response.status(500).json({ message: "Failed to create post." });
  }
};

const editPost = async (request, response) => {
  try {
    const postId = getPostId(request);
    const post = await findOwnedPost(postId, request.userId);

    if (!post) {
      return response.status(404).json({ message: "Post not found or you are not allowed to edit it." });
    }

    if (typeof request.body.caption !== "string") {
      return response.status(400).json({ message: "caption must be a string." });
    }

    post.caption = request.body.caption.trim();
    await post.save();

    return response.status(200).json({ message: "Post updated successfully.", post });
  } catch (error) {
    console.error("Edit post error:", error);
    return response.status(500).json({ message: "Failed to update post." });
  }
};

const deletePost = async (request, response) => {
  try {
    const postId = getPostId(request);
    const post = await findOwnedPost(postId, request.userId);

    if (!post) {
      return response.status(404).json({ message: "Post not found or you are not allowed to delete it." });
    }

    await post.deleteOne();
    return response.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Delete post error:", error);
    return response.status(500).json({ message: "Failed to delete post." });
  }
};

const commentPost = async (request, response) => {
  try {
    const { content } = request.body;
    const postId = getPostId(request);

    if (!isValidPostId(postId)) {
      return response.status(400).json({ message: "A valid postId is required." });
    }

    if (!content?.trim()) {
      return response.status(400).json({ message: "Comment content is required." });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { userId: request.userId, content: content.trim() } } },
      { new: true, runValidators: true }
    );

    if (!post) {
      return response.status(404).json({ message: "Post not found." });
    }

    return response.status(201).json({ message: "Comment added successfully.", post });
  } catch (error) {
    console.error("Comment post error:", error);
    return response.status(500).json({ message: "Failed to add comment." });
  }
};

const likePost = async (request, response) => {
  try {
    const postId = getPostId(request);

    if (!isValidPostId(postId)) {
      return response.status(400).json({ message: "A valid postId is required." });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: request.userId }, $pull: { dislikes: request.userId } },
      { new: true }
    );

    if (!post) {
      return response.status(404).json({ message: "Post not found." });
    }

    return response.status(200).json({ message: "Post liked successfully.", post });
  } catch (error) {
    console.error("Like post error:", error);
    return response.status(500).json({ message: "Failed to like post." });
  }
};

const dislikePost = async (request, response) => {
  try {
    const postId = getPostId(request);

    if (!isValidPostId(postId)) {
      return response.status(400).json({ message: "A valid postId is required." });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { dislikes: request.userId }, $pull: { likes: request.userId } },
      { new: true }
    );

    if (!post) {
      return response.status(404).json({ message: "Post not found." });
    }

    return response.status(200).json({ message: "Post disliked successfully.", post });
  } catch (error) {
    console.error("Dislike post error:", error);
    return response.status(500).json({ message: "Failed to dislike post." });
  }
};

const getPosts = async (request, response) => {
    try {
        const currentUserId = request.userId;
        const otherUserId = request.body.userId;

        if (!otherUserId) {
            return response.status(400).json({
                message: "userId is required",
            });
        }

        const posts = await Post.find({
            userId: otherUserId,
        }).sort({ createdAt: -1 });

        return response.status(200).json({
            currentUserId,
            posts,
        });
    } catch (error) {
        console.error("Get posts error:", error);

        return response.status(500).json({
            message: "Failed to get posts",
        });
    }
};



export { createPost, editPost, deletePost, commentPost, likePost, dislikePost, getPosts };
