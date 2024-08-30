import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateNavbar = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("userData");
    window.localStorage.removeItem("userRole");
    navigate("/login");
    alert("Logout Successfull");
  };

  return (
    <nav className="primary-link">
      <div className="hamburger-icon" onClick={toggleMenu}>
        ☰
      </div>

      <div className={`menu ${menuOpen ? "active" : ""}`}>
        <NavLink exact to="/" activeClassName="" onClick={toggleMenu}>
          Home
        </NavLink>

        {auth.role !== "Normal User" && auth.role !== "Manager" && (
          <NavLink to="/users" activeClassName="" onClick={toggleMenu}>
            Users
          </NavLink>
        )}

        {auth.role !== "Normal User" && (
          <NavLink to="/reports" activeClassName="" onClick={toggleMenu}>
            Reports
          </NavLink>
        )}

        {auth.role !== "Normal User" && (
          <NavLink
            to="/team-management"
            activeClassName=""
            onClick={toggleMenu}
          >
            Team Management
          </NavLink>
        )}

        {auth.role !== "Normal User" && (
          <NavLink to="/data-entries" activeClassName="" onClick={toggleMenu}>
            Data Entries
          </NavLink>
        )}

        <NavLink to="/profile" activeClassName="" onClick={toggleMenu}>
          Profile
        </NavLink>

        {auth.role !== "Normal User" &&
          auth.role !== "Manager" &&
          auth.role !== "Admin" && (
            <NavLink to="/setting" activeClassName="" onClick={toggleMenu}>
              Setting
            </NavLink>
          )}

        <NavLink to="/login" activeClassName="" onClick={handleLogout}>
          Logout
        </NavLink>
      </div>
    </nav>
  );
};

export default PrivateNavbar;
