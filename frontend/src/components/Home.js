import { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";

const initialFormData = {
  username: "",
  email: "",
  role: ""
};

const Profile = () => {

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`/auth/current-user`);
        const data = response.data.data;

        setFormData({ role: data.user.role, username: data.user.username, email: data.user.email });
      } catch (error) {
        const response = error.response;
      }
    };

    getUser();
  }, []); 

  return (
    <div>
      <div className="profile-container">
          <h2 className="profile-title">{formData.role}</h2>
          <p className="profiledata">Name: {formData.username}</p>
          <p className="profiledata">Email: {formData.email}</p>
      </div>
    </div>
  );
};

export default Profile;
