import { useQuery, useMutation } from "react-query";
import Ax from "../utils/Axios";

// Fetch the current authenticated user
const fetchUser = async () => {
  return await Ax.get("whoami");
};

// Login user with credentials
const loginUser = async (body) => {
  return await Ax.post("auth", body);
};

// Register a new user
const registerUser = async (body) => {
  return await Ax.post("register", body);
};

// Logout the current user
const logoutUser = async () => {
  return await Ax.post("logout");
};

// Update user profile information
const userUpdate = async (body) => {
  return await Ax.patch("me", body);
};

// Update user password
const userUpdatePassword = async (body) => {
  return await Ax.patch("me/pw", body);
};

// Delete the current user account
const userDelete = async () => {
  return await Ax.delete("me");
};

// React Query hook: fetch user data
const useUser = () =>
  useQuery("user", fetchUser, {
    refetchOnWindowFocus: false,
    retry: false,
  });

// React Query hooks for user mutations
const useLoginUser = () => useMutation("loginUser", loginUser);
const useLogoutUser = () => useMutation("logoutUser", logoutUser);
const useRegisterUser = () => useMutation("registerUser", registerUser);
const useUserUpdate = () => useMutation("updateUser", userUpdate);
const useUserUpdatePassword = () =>
  useMutation("updateUserPassword", userUpdatePassword);
const useUserDelete = () => useMutation("deleteUser", userDelete);

// Export hooks for use in components
export {
  useUser,
  useLoginUser,
  useRegisterUser,
  useLogoutUser,
  useUserUpdate,
  useUserUpdatePassword,
  useUserDelete,
};
