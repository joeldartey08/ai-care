import { useState } from "react";
import { useNavigation } from "react-router-dom";

function Login() {
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prev) => ({ ...prev, [name]: value }));
  };

  async function handSubmit(e) {
    e.preventDefault();
    console.log(loginDetails);
    try {
      if (!loginDetails.email || !loginDetails) {
        alert("all fields required");
        return;
      }
      const response = await fetch(
        "https://untendered-atlantal-florance.ngrok-free.dev/api/v1/auth/login",
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

      
    } catch (error) {
      console.error("login error", error);
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

      <button className="btn login-btn" style={{ width: "100%" }}>
        Login
      </button>
    </form>
  );
}

export default Login;
