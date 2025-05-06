import axios from "axios";

// Import the QueryClient from React Query for managing server state
import { QueryClient } from "react-query";

// Initialize a new QueryClient instance for React Query
const queryClient = new QueryClient();

//CHAGE THIS TO YOUR OWN API
const AXIOS_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_URL
    : "http://localhost:3001/api/";

const apiClient = axios.create({
  baseURL: AXIOS_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Replace with your token logic
  },
});

export default apiClient;

export { AXIOS_URL, queryClient };
