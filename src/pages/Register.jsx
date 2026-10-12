import { useState } from "react";
import { useNavigate } from "react-router-dom";

const diseases = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Allergies",
  "HIV/AIDS",
];

const Register = () => {
  const [registerDetails, setRegisterDetails] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    bloodGroup: "",
    diseases: [],
  });
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterDetails({ ...registerDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!registerDetails.email || !registerDetails.password) {
        alert("all fields are required");
        return;
      }
      const response = await fetch(
        "https://untendered-atlantal-florance.ngrok-free.dev/api/v1/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerDetails),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message ?? "Login Failed");
        throw data;
      }

      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-page">
      <h2 className="login-title">Create an Account</h2>
      <p className="login-subtitle">Sign up to get started</p>

      {/* Username Field */}
      <div className="form-group">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          id="username"
          className="form-input"
          name="username"
          placeholder="Username"
          onChange={(e) => handleChange(e)}
          value={registerDetails.username}
        />
      </div>

      {/* Email Field */}
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          className="form-input"
          name="email"
          type="email"
          value={registerDetails.email}
          onChange={(e) => handleChange(e)}
          placeholder="Email"
        />
      </div>

      {/* Password Field */}
      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          className="form-input"
          name="password"
          type="password"
          placeholder="Password"
          value={registerDetails.password}
          onChange={(e) => handleChange(e)}
        />
      </div>

      {/* Sex (Radio Buttons) */}
      <div className="form-group">
        <label className="form-label">Sex</label>
        <div style={{ display: "flex", gap: "15px", marginTop: "5px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={registerDetails.gender === "Male"}
              onChange={(e) => handleChange(e)}
            />
            Male
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={registerDetails.gender === "Female"}
              onChange={(e) => handleChange(e)}
            />
            Female
          </label>
        </div>
      </div>

      {/* Blood Group (Dropdown Select) */}
      <div className="form-group">
        <label htmlFor="bloodGroup" className="form-label">
          Blood Group
        </label>
        <select
          id="bloodGroup"
          className="form-input"
          name="bloodGroup"
          value={registerDetails.bloodGroup}
          onChange={(e) => handleChange(e)}
          style={{ width: "100%", height: "40px", background: "transparent" }}
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>

      {/* Medical History / Diseases (Checkboxes) */}
      <div className="form-group">
        <label className="form-label">
          Medical History (Select all that apply)
        </label>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "5px",
          }}
        >
          {diseases.map((item, index) => (
            <label
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="diseases"
                value={item}
                onChange={(e) => {
                  const { value, checked } = e.target;

                  setRegisterDetails((prev) => {
                    const updated = checked
                      ? [...prev.diseases, value]
                      : prev.diseases.filter((it) => it !== value);

                    return { ...prev, diseases: updated };
                  });
                }}
                checked={registerDetails.diseases.includes(item)}
              />
              <span style={{ fontSize: "14px" }}>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        className="btn login-btn"
        style={{ width: "100%", marginTop: "10px" }}
        disabled={isLoading}
      >
        {isLoading ? "Loading" : "Register"}
      </button>
    </form>
  );
};

export default Register;
