import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";

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
    setRegisterDetails((currentDetails) => ({
      ...currentDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!registerDetails.email.trim() || !registerDetails.password) {
      toast.error("Enter your email and password to create an account.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://ai-care-backend-45fz.onrender.com/api/v1/auth/signup",
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
        throw new Error(data.message ?? "Unable to create your account.");
      }

      toast.success("Account created. Sign in to continue.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(
        error.message ?? "Something went wrong while creating your account.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      mode="register"
      eyebrow="YOUR CARE JOURNEY"
      title="Create your account"
      description="Get started with a space to explore your health questions."
    >
      <form onSubmit={handleSubmit} className="auth-form auth-register-form">
        <div className="auth-form-grid">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              className="form-input"
              name="username"
              autoComplete="username"
              placeholder="Choose a username"
              onChange={handleChange}
              value={registerDetails.username}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              className="form-input"
              name="email"
              type="email"
              autoComplete="email"
              value={registerDetails.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group auth-field-wide">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              className="form-input"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={registerDetails.password}
              onChange={handleChange}
              required
            />
          </div>

          <fieldset className="auth-choice-fieldset">
            <legend>Sex</legend>
            <div className="auth-choice-row">
              {["Male", "Female"].map((gender) => (
                <label className="auth-choice-option" key={gender}>
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={registerDetails.gender === gender}
                    onChange={handleChange}
                  />
                  <span>{gender}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="form-group">
            <label htmlFor="bloodGroup" className="form-label">
              Blood group
            </label>
            <select
              id="bloodGroup"
              className="form-input auth-select"
              name="bloodGroup"
              value={registerDetails.bloodGroup}
              onChange={handleChange}
            >
              <option value="">Select blood group</option>
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

          <fieldset className="auth-choice-fieldset auth-medical-fieldset auth-field-wide">
            <legend>
              Medical history <span>Select any that apply</span>
            </legend>
            <div className="auth-disease-grid">
              {diseases.map((disease) => (
                <label className="auth-choice-option" key={disease}>
                  <input
                    type="checkbox"
                    name="diseases"
                    value={disease}
                    onChange={(event) => {
                      const { value, checked } = event.target;
                      setRegisterDetails((currentDetails) => ({
                        ...currentDetails,
                        diseases: checked
                          ? [...currentDetails.diseases, value]
                          : currentDetails.diseases.filter(
                              (item) => item !== value,
                            ),
                      }));
                    }}
                    checked={registerDetails.diseases.includes(disease)}
                  />
                  <span>{disease}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <button className="auth-submit-button" disabled={isLoading}>
          {isLoading ? "Creating your account..." : "Create account"}
          {!isLoading && <span aria-hidden="true">↗</span>}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
