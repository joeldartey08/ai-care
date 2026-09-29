import { useState } from "react";

function Register() {
  const [registerDetails, setRegisterDetails] = useState({
    username: "",
    email: "",
    password: "",
    sex: "",
    bloodGroup: "",
    diseases: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterDetails({ ...registerDetails, [name]: value });

    console.log(registerDetails);
  };

  return (
    <form className="login-page">
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
        />
      </div>

      {/* Sex (Radio Buttons) */}
      <div className="form-group">
        <label className="form-label">Sex</label>
        <div style={{ display: "flex", gap: "15px", marginTop: "5px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="radio"
              name="sex"
              // value="Male"
              // checked={registerDetails.sex === "Male"}
              // onChange={handleChange}
            />
            Male
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="radio"
              // name="sex"
              // value="Female"
              // checked={registerDetails.sex === "Female"}
              // onChange={handleChange}
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
          // value={registerDetails.bloodGroup}
          // onChange={handleChange}
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
          {["Diabetes", "Hypertension", "Asthma", "Allergies"].map(
            (disease) => (
              <label
                key={disease}
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
                  value={disease}
                  checked={registerDetails.diseases.includes(disease)}
                  // onChange={(e) => {
                  //   const { value, checked } = e.target;
                  //   setRegisterDetails((prev) => {
                  //     // If checked, add to array; if unchecked, remove from array
                  //     const updatedDiseases = checked
                  //       ? [...prev.diseases, value]
                  //       : prev.diseases.filter((item) => item !== value);

                  //     return { ...prev, diseases: updatedDiseases };
                  //   });
                  // }}
                />
                <span style={{ fontSize: "14px" }}>{disease}</span>
              </label>
            ),
          )}
        </div>
      </div>

      <button
        className="btn login-btn"
        style={{ width: "100%", marginTop: "10px" }}
      >
        Register
      </button>
    </form>
  );
}

export default Register;
