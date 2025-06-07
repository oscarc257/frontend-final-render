import React, { useEffect } from "react";
import { queryClient } from "../constants/config";
import Axios from "../utils/Axios";

// Sets up an Axios response interceptor to handle global API errors
const SetupInterceptor = () => {
  // Add a response interceptor
  const InterceptorID = Axios.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
      // If the error is 401 Unauthorized, refetch user data (could trigger logout or refresh)
      if (error?.response?.status === 401) {
        queryClient.refetchQueries("user");
        // Note: missing return here, should be 'return Promise.reject(error);'
        Promise.reject(error);
      } else {
        // For all other errors, just reject as usual
        return Promise.reject(error);
      }
    }
  );
  return InterceptorID;
};

// React component to mount/unmount the interceptor
const Interceptor = () => {
  useEffect(() => {
    // Set up the interceptor on mount
    const InterceptorID = SetupInterceptor();
    // Eject the interceptor on unmount to prevent memory leaks
    return () => {
      Axios.interceptors.response.eject(InterceptorID);
    };
  }, []);

  // This component does not render anything
  return <></>;
};

export default Interceptor;
