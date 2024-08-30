import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import signupValidator from "../validators/signupValidator";

const initialFormData = {
  username: "",
  email: "",
  password: "",
  role: "",
};

const initialFormError = {
  username: "",
  email: "",
  password: "",
  role: "",
};

const NewUser = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUserRole = () => {
      const role = localStorage.getItem("userRole");
      setCurrentUserRole(role);
    };

    fetchCurrentUserRole();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = signupValidator({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    if (errors.username || errors.email || errors.password || errors.role) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);

        const requestBody = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

        const response = await axios.post("/auth/register", requestBody);
        const data = response.data;

        alert("User Created Successfully");

        setFormData(initialFormData);
        setFormError(initialFormError);
        setLoading(false);
        navigate("/users");
      } catch (error) {
        setLoading(false);
        setFormError(initialFormError);
      }
    }
  };

  const availableRoles =
    currentUserRole === "Super Admin"
      ? ["Super Admin", "Admin", "Manager", "Normal User"]
      : currentUserRole === "Admin"
      ? ["Admin", "Manager", "Normal User"]
      : [];

  return (
    <div className="main-container">
      <button className="back-button button-block" onClick={() => navigate(-1)}>
        Back
      </button>
      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <h2 className="form-title">Create User</h2>
          <div className="form-group">
            <label>User Name</label>
            <input
              className="form-control"
              type="text"
              name="username"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
            />
            {formError.username && (
              <p className="error">{formError.username}</p>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="text"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
            />
            {formError.email && <p className="error">{formError.email}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="***********"
              value={formData.password}
              onChange={handleChange}
            />
            {formError.password && (
              <p className="error">{formError.password}</p>
            )}
          </div>

          <div className="form-group">
            <label className="inner-label">Role</label>
            <select
              className="form-control"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={availableRoles.length === 0}
            >
              <option value="">Select Role</option>
              {availableRoles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {formError.role && <p className="error">{formError.role}</p>}
          </div>

          <div className="form-group">
            <input
              className="button"
              type="submit"
              value={`${loading ? "Saving..." : "Create User"}`}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewUser;
