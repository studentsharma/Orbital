import api from "./client";

export const register = (data) => api.post("/api/auth/register", data);

export const login = (data) => api.post("/api/auth/login", data);

export const resendVerificationCode = (email) =>
  api.post("/api/auth/resend-verification-code", { email });

export const getCurrentUser = () => api.post("/api/user/get-user");

export const getFollowers = () => api.post("/api/user/get-follower");

export const getFollowing = () => api.post("/api/user/get-following");

export const getUserPosts = (userId) =>
  api.post("/api/posts/get-posts", { userId });

export const getGlobalFeed = () => api.post("/api/posts/get-global-feed");

export const createPost = (formData) =>
  api.post("/api/posts/create-post", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

export const editPost = (data) => api.post("/api/posts/edit-post", data);

export const deletePost = (postId) =>
  api.delete("/api/posts/delete-post", { data: { postId } });

export const addComment = (data) => api.post("/api/posts/post-comment", data);

export const likePost = (postId) =>
  api.post("/api/posts/post-like", { postId });

export const dislikePost = (postId) =>
  api.post("/api/posts/post-dislike", { postId });
