import axiosClient from "./axiosClient.js";

/**
 * Each function maps 1:1 to a route in Backend/src/routes/user.routes.js.
 * All return `response.data.data` (the `data` field of ApiResponse) unless
 * noted otherwise, so callers work directly with the resource, not the
 * envelope.
 */

// POST /users/register  (multipart/form-data)
export async function registerUser(formValues) {
  const formData = new FormData();
  formData.append("fullName", formValues.fullName);
  formData.append("username", formValues.username);
  formData.append("email", formValues.email);
  formData.append("password", formValues.password);
  if (formValues.avatar) formData.append("avatar", formValues.avatar);
  if (formValues.coverimage) formData.append("coverimage", formValues.coverimage);

  const response = await axiosClient.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
}

// POST /users/login
export async function loginUser({ identifier, password }) {
  const isEmail = identifier.includes("@");
  const payload = {
    password,
    ...(isEmail ? { email: identifier } : { username: identifier }),
  };
  const response = await axiosClient.post("/users/login", payload);
  return response.data.data; // { user, accessToken, refreshToken }
}

// POST /users/logout  (protected)
export async function logoutUser() {
  const response = await axiosClient.post("/users/logout");
  return response.data;
}

// POST /users/refresh-token
export async function refreshAccessToken() {
  const response = await axiosClient.post("/users/refresh-token");
  return response.data.data;
}

// GET /users/current-user  (protected)
export async function getCurrentUser() {
  const response = await axiosClient.get("/users/current-user");
  return response.data.data;
}

// PATCH /users/change-password  (protected)
export async function changeCurrentPassword({ oldPassword, newPassword }) {
  const response = await axiosClient.patch("/users/change-password", {
    oldPassword,
    newPassword,
  });
  return response.data;
}

// PATCH /users/update-account  (protected)
export async function updateAccountDetails({ fullName, email }) {
  const response = await axiosClient.patch("/users/update-account", {
    fullName,
    email,
  });
  return response.data.data;
}

// PATCH /users/avatar  (protected, multipart — field name "avatar")
export async function updateUserAvatar(avatarFile) {
  const formData = new FormData();
  formData.append("avatar", avatarFile);
  const response = await axiosClient.patch("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
}

// PATCH /users/cover-image  (protected, multipart — field name "coverImage", capital I)
export async function updateUserCoverImage(coverImageFile) {
  const formData = new FormData();
  formData.append("coverImage", coverImageFile);
  const response = await axiosClient.patch("/users/cover-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
}
