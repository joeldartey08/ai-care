import { useState } from "react";
import { useNavigation } from "react-router-dom";

function Login() {
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prev) => ({ ...prev, [name]: value }));
    console.log(loginDetails);
  };

  async function handSubmit(e) {
    e.preventDefault();
    console.log(loginDetails);
    if (!loginDetails.email || !loginDetails.password) {
      alert("All fields are required");
      return;
    }

    const response = await fetch("https://example.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginDetails),
    });

    const data = await response.json();

    if (!response.ok) {
      alert("login failed");
      return;
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
