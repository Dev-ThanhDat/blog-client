import axios from './axiosCustom';

// Auth
export const postSignup = (username, email, password) => {
  return axios.post('/api/auth/signup', { username, email, password });
};

export const postSignin = (email, password) => {
  return axios.post('/api/auth/signin', { email, password });
};

export const postGoogle = (name, email, googlePhotoUrl) => {
  return axios.post('/api/auth/google', { name, email, googlePhotoUrl });
};

export const postSignout = () => {
  return axios.post('/api/auth/signout');
};

// User
export const putUpdateUser = (userId, data) => {
  return axios.put(`/api/user/update/${userId}`, data);
};

export const deleteUser = (userId) => {
  return axios.delete(`/api/user/delete/${userId}`);
};

export const getUsers = ({ skip, limit }) => {
  let params = {};
  if (skip) {
    params.skip = skip;
  }
  if (limit) {
    params.limit = limit;
  }
  return axios.get('/api/user/getusers', { params });
};

export const getUser = (userId) => {
  return axios.get(`/api/user/${userId}`);
};

// Post
export const postCreatePost = (data) => {
  return axios.post('/api/post/create', data);
};

export const getPosts = ({ userId, skip, postId, slug, limit, searchTerm }) => {
  let params = {};
  if (userId) {
    params.userId = userId;
  }
  if (skip) {
    params.skip = skip;
  }
  if (postId) {
    params.postId = postId;
  }
  if (slug) {
    params.slug = slug;
  }
  if (limit) {
    params.limit = limit;
  }
  if (searchTerm) {
    params.searchTerm = searchTerm;
  }
  return axios.get('/api/post/getposts', { params });
};

export const deletePost = (postIdToDelete, userId) => {
  return axios.delete(`/api/post/deletepost/${postIdToDelete}/${userId}`);
};

export const putUpdatepost = (postIdToDelete, userId, data) => {
  return axios.put(`/api/post/updatepost/${postIdToDelete}/${userId}`, data);
};

// Comment
export const postCreateComment = (data) => {
  return axios.post('/api/comment/create', data);
};

export const getPostComments = (postId) => {
  return axios.get(`/api/comment/getPostComments/${postId}`);
};

export const putLikeComment = (commentId) => {
  return axios.put(`/api/comment/likeComment/${commentId}`);
};

export const putEditComment = (commentId, content) => {
  return axios.put(`/api/comment/editComment/${commentId}`, content);
};

export const deleteComment = (commentId) => {
  return axios.delete(`/api/comment/deleteComment/${commentId}`);
};

export const getComments = ({ skip, limit }) => {
  let params = {};
  if (skip) {
    params.skip = skip;
  }
  if (limit) {
    params.limit = limit;
  }
  return axios.get('/api/comment/getcomments', { params });
};
