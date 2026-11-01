import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContent } from "../stores/AuthStore";

function Login() {
  const navigate = useNavigate();
  const authStore = useContext(AuthContent);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prev) => ({ ...prev, [name]: value }));
  };

  async function handSubmit(e) {
    e.preventDefault();
    console.log(loginDetails);
    setLoading(true);
    try {
      if (!loginDetails.email || !loginDetails.password) {
        alert("all fields required");
        return;
      }
      const response = await fetch(
        "https://ai-care-backend-45fz.onrender.com/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginDetails),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message ?? "login failed");
        throw new Error(data.message ?? "NetWork Error");
      }

      console.log(data);

      const token = data.token ?? data.accessToken ?? data.data?.token;

      if (!token) {
        throw new Error("Login response did not include an authentication token");
      }

      localStorage.setItem("auth_token", token);
      authStore?.setAuthenticated(true);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("login error", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handSubmit} className="login-page">
      <h2 className="login-title">Welcome back</h2>
      <p className="login-subtitle">Sign in to continue</p>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          className="form-input"
          onChange={(e) => handleChange(e)}
          name="email"
          placeholder="Email"
          value={loginDetails.email}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          className="form-input"
          onChange={(e) => handleChange(e)}
          name="password"
          type="password"
          placeholder="Password"
          value={loginDetails.password}
        />
      </div>

      <button
        className="btn login-btn"
        style={{ width: "100%" }}
        disabled={isLoading}
      >
        {isLoading ? "Loading" : "Login"}
      </button>
      <p>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}

export default Login;
