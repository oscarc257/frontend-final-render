// Import the Axios library for making HTTP requests
import axios from "axios";
// Import the dynamically set base URL from the configuration file
import { AXIOS_URL } from "../constants/config";

// Create an Axios instance with default configurations
const Ax = axios.create({
  baseURL: AXIOS_URL, // Dynamically set base URL based on the environment
  withCredentials: true, // Include credentials (e.g., cookies) in cross-origin requests
  headers: {
    "Content-Type": "application/json", // Default content type
    // Add Authorization header if needed
    // Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Function to fetch exchange rates from the backend
export const fetchExchangeRates = async (baseCurrency) => {
  try {
    // Make a GET request to the `/exchange-rates` endpoint with the base currency as a query parameter
    const response = await Ax.get("/exchange-rates", {
      params: { base: baseCurrency }, // Pass the base currency as a query parameter
    });
    // Log the response data (exchange rates) to the console
    console.log(response.data);
    return response.data;
  } catch (error) {
    // Improved error handling
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    throw error; // Re-throw the error for further handling
  }
};

// Export the Axios instance for use in other parts of the application
export default Ax;
