import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import loginValidator from "../validators/loginValidator";

const initialFormData = {
  email: "",
  password: "",
};

const initialFormError = {
  email: "",
  password: "",
};

const Login = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = loginValidator({
      email: formData.email,
      password: formData.password,
    });

    if (errors.email || errors.password) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);

        const response = await axios.post("/auth/login", formData);
        const data = response.data;

        if (data && data.data && data.data.user && data.data.user.role) {
          const userRole = data.data.user.role;

          window.localStorage.setItem("userData", JSON.stringify(data.data));
          window.localStorage.setItem("userRole", userRole);

          window.alert("Login Successfully");

          setFormData(initialFormData);
          setFormError(initialFormError);
          setLoading(false);
          navigate("/");
        } else {
          throw new Error("Role not found in the response");
        }
      } catch (error) {
        setLoading(false);
        setFormError(initialFormError);
      }
    }
  };

  return (
    <div className="form-container">
      <form className="inner-container" onSubmit={handleSubmit}>
        <h2 className="form-title">Login Form</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {formError.email && <div className="error">{formError.email}</div>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {formError.password && (
            <div className="error">{formError.password}</div>
          )}
        </div>

        <div className="form-group">
          <button type="submit" value={`${loading ? "Loging..." : "Login"}`}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
