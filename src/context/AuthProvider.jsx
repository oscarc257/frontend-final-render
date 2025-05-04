import { createContext, useState, useEffect } from "react";
import { useUser } from "../queries/user";
import { queryClient } from "../constants/config";
import { useNavigate } from "react-router-dom";

// Create the AuthContext with default values
const AuthContext = createContext({
  auth: false, // Default authentication state is false
  setAuth: () => {}, // Placeholder function for updating authentication state
});

const AuthProvider = ({ children }) => {
  // State to manage the authentication status
  const [auth, setAuth] = useState();

  // Fetch the currently authenticated user using the custom hook
  const { data, isError } = useUser();

  // Value to be provided to components consuming the AuthContext
  const value = { auth, setAuth };

  // Hook for programmatic navigation
  const Navigate = useNavigate();

  // Effect to update authentication state based on user data or errors
  useEffect(() => {
    if (data) {
      // If user data is available and contains a userId, set authentication to true
      if (data?.data.userId) setAuth(true);
    }
    if (isError) {
      // If an error occurs (e.g., user is not authenticated), set authentication to false
      setAuth(false);
      queryClient.removeQueries(); // Clear all cached queries
    }
  }, [data, isError, Navigate]);

  // Provide the authentication state and updater function to child components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the AuthContext and AuthProvider for use in other parts of the application
export { AuthContext, AuthProvider };
