import { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import profileValidator from "../validators/profileValidaotor";

const initialFormData = {
  username: "",
  email: "",
  role: "",
};

const initialFormError = {
  username: "",
  email: "",
  role: "",
};

const UpdateUser = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState("");

  const navigate = useNavigate();

  const params = useParams();
  const userId = params.id;

  useEffect(() => {
    if (userId) {
      const getUser = async () => {
        try {
          const response = await axios.get(`/users/${userId}`);
          const data = response.data.data;

          setFormData({
            username: data.user.username,
            email: data.user.email,
            role: data.user.role,
          });
        } catch (error) {
          const response = error.response;
          const data = response.data;
        }
      };

      getUser();
    }
  }, [userId]);

  useEffect(() => {
    const fetchCurrentUserRole = () => {
      const role = localStorage.getItem("userRole"); // Example: "Super Admin"
      setCurrentUserRole(role);
    };

    fetchCurrentUserRole();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = profileValidator({
      username: formData.username,
      email: formData.email,
      role: formData.role,
    });

    if (errors.username || errors.email || errors.role) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);

        const response = await axios.put(`/users/${userId}`, formData);
        const data = response.data;

        alert("User Updated Successfully");

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
          <h2 className="inner-title">Update User</h2>
          <div className="form-group">
            <label className="inner-label">User Name</label>
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
            <label className="inner-label">Email</label>
            <input
              className="form-control"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
            />
            {formError.email && <p className="error">{formError.email}</p>}
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
              value={`${loading ? "Updating..." : "Update"}`}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
