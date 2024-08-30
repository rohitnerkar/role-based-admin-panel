import { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import profileValidator from "../validators/profileValidaotor";

const initialFormData = {
  username: "",
  email: "",
};

const initialFormError = {
  username: "",
  email: "",
};

const Profile = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);
  const [oldEmail, setOldEmail] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`/auth/current-user`);
        const data = response.data.data;

        setFormData({ username: data.user.username, email: data.user.email });
        setOldEmail(data.user.email);
      } catch (error) {
        const response = error.response;
        const data = response.data;
      }
    };

    getUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = profileValidator({
      username: formData.username,
      email: formData.email,
    });

    if (errors.username || errors.email) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);

        const response = await axios.put("/auth/update-profile", formData);
        const data = response.data;

        alert("User Updated Successfully");

        setFormError(initialFormError);
        setLoading(false);

        if (oldEmail !== formData.email) {
          window.localStorage.removeItem("userData");
          navigate("/login");
        }
      } catch (error) {
        setLoading(false);
        setFormError(initialFormError);
      }
    }
  };

  return (
    <div className="main-container">
      <button className="back-button button-block" onClick={() => navigate(-1)}>
        Back
      </button>

      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <h2 className="inner-title">Update profile</h2>
          <div className="form-group">
            <label className="inner-label">Name</label>
            <input
              className="form-control"
              type="text"
              name="username"
              placeholder="Jhon Doe"
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
              type="email"
              name="email"
              placeholder="doe@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
            {formError.email && <p className="error">{formError.email}</p>}
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

export default Profile;
