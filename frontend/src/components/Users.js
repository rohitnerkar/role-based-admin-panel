import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/users");
        const data = response.data.data;
        setUsers(data.users);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
        alert("Something went wrong");
      }
    };

    getUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      await axios.delete(`/users/${id}`);
      alert("User Deleted Successfully");

      const response = await axios.get("/users");
      const data = response.data.data;
      setUsers(data.users);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "rgb(243, 239, 236)", height: "155vh" }}>
      <div className="topdiv">
        <button
          type="button"
          className="add-user-button"
          onClick={() => navigate("create-user")}
        >
          <span className="button__text">Create User</span>
        </button>
      </div>

      <h2 className="table-title">Users List</h2>

      {loading ? (
        "Loading..."
      ) : users.length === 0 ? (
        "No user available"
      ) : (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{moment(user.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                <td>{moment(user.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                <td>
                  <button
                    style={{ color: "blue" }}
                    className="action-button"
                    onClick={() => navigate(`update-user/${user._id}`)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    style={{ color: "red" }}
                    className="action-button"
                    onClick={() => handleDelete(user._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
