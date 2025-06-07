import { useEffect } from "react";
import { useUser } from "../queries/user";
import { queryClient } from "../constants/config";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

// AuthGuard component to protect routes based on authentication state
const AuthGuard = ({ children }) => {
  // Fetch user data and loading states
  const {
    data: user,
    isLoading: userLoading,
    isRefetching: userRefetching,
  } = useUser();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated and tries to access auth/register, redirect to home
    if (user?.data?.userId) {
      if (pathname === "/auth" || pathname === "/register") {
        navigate("/");
      } else navigate(pathname);
    }

    // If user is not authenticated and not loading/refetching, redirect to /auth (unless already there)
    if (!userLoading && !user?.data && !userRefetching) {
      if (pathname !== "/auth" && pathname !== "/register") {
        queryClient.removeQueries();
        navigate("/auth");
        return;
      }
      return;
    }
  }, [user, userLoading, userRefetching, pathname, navigate]);

  return (
    <>
      {/* Show spinner while loading, otherwise render children */}
      {userLoading ? <Spinner background={"tranparent"} fullPage /> : children}
    </>
  );
};

export default AuthGuard;
