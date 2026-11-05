import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContent } from "../stores/AuthStore";
import AuthLayout from "../components/AuthLayout";

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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!loginDetails.email.trim() || !loginDetails.password) {
      toast.error("Enter your email and password to continue.");
      return;
    }

    setLoading(true);
    try {
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
        throw new Error(data.message ?? "Unable to log in. Please try again.");
      }

      const token = data.token ?? data.accessToken ?? data.data?.token;

      if (!token) {
        throw new Error("Login response did not include an authentication token");
      }

      localStorage.setItem("auth_token", token);
      authStore?.setAuthenticated(true);
      toast.success("Welcome back.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("login error", error);
      toast.error(
        error.message ?? "Something went wrong while signing you in.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      mode="login"
      eyebrow="WELCOME BACK"
      title="Sign in to your account"
      description="Continue your care conversations whenever you need them."
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            id="email"
            className="form-input"
            onChange={handleChange}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={loginDetails.email}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            className="form-input"
            onChange={handleChange}
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={loginDetails.password}
            required
          />
        </div>

        <button className="auth-submit-button" disabled={isLoading}>
          {isLoading ? "Signing you in..." : "Sign in"}
          {!isLoading && <span aria-hidden="true">↗</span>}
        </button>
        <p className="auth-switch">
          New to AI Care? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;
