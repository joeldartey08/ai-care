import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

function ProtectRoute({ role }) {
  const token = localStorage.getItem("auth_token");
  const authStore = useContext();
  if (!token) {
    <Navigate to="/" replace />;
  }

  return <div>ProtectRoute</div>;
}

export default ProtectRoute;
