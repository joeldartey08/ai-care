import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContent } from "../stores/AuthStore";

function ProtectRoute({ children }) {
  const token = localStorage.getItem("auth_token");
  const authStore = useContext(AuthContent);
  const setUser = authStore?.setUser;
  const setAuthenticated = authStore?.setAuthenticated;
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function fetchUser() {
      try {
        const response = await fetch(
          "https://ai-care-backend-45fz.onrender.com/api/v1/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const backendResponse = await response.json();

        if (!response.ok) {
          throw new Error(
            backendResponse.message ?? "Unable to load your account",
          );
        }

        const user = backendResponse.data?.user;
        if (!user) {
          throw new Error("The server did not return user details");
        }

        setUser?.(user);
        setAuthenticated?.(true);
        setError("");
      } catch (error) {
        console.error(error);
        setError(error.message ?? "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [token, retryCount, setAuthenticated, setUser]);

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (isLoading) {
    return (
      <div className="protected-route-state" role="status">
        <div className="protected-route-card protected-route-loading">
          Loading your account...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="protected-route-state" role="alert">
        <div className="protected-route-card">
          <p className="protected-route-error">{error}</p>
          <button
            className="btn"
            onClick={() => {
              setIsLoading(true);
              setError("");
              setRetryCount((count) => count + 1);
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return children ?? <Outlet />;
}

export default ProtectRoute;
