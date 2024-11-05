import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import HomeIcon from "@mui/icons-material/Home";
import HelpIcon from "@mui/icons-material/Help";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const auth = useAuth();

  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  return (
    <nav>
      <div className="logo-wrap">
        <Link to="/">
          <img src="./img/logo.png" alt="logo" className="logo" />
        </Link>
      </div>
      <div
        className={`menu ${showMenu ? "open" : ""}`}
        onClick={() => setShowMenu(!showMenu)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`links ${showMenu ? "open" : ""}`}>
        <Link to="/" className="nav-button">
          <HomeIcon />
          Koti
        </Link>
        <Link to="/about" className="nav-button">
          <HelpIcon />
          Meistä
        </Link>
        <Link to="/store" className="nav-button">
          <StorefrontIcon />
          Kauppa
        </Link>

        {/* Dropdown for Authenticated Links */}
        {auth.token && (
          <div className="dropdown">
            <button className="nav-button" onClick={toggleDropdown}>
              <AddCircleIcon />
              Toiminnot
            </button>
            <ul className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
              <li>
                <Link to="/add" className="nav-button">
                  <AddCircleIcon />
                  Lisää tuote
                </Link>
              </li>
              <li>
                <Link to="/create" className="nav-button">
                  <AddCircleIcon />
                  Luo päivitys
                </Link>
              </li>
              <li>
                <Link to="/addcarousel" className="nav-button">
                  <AddCircleIcon />
                  Lisää karuselliin
                </Link>
              </li>
            </ul>
          </div>
        )}

        {auth.token ? (
          <Link to="/logout" className="nav-button">
            <LogoutIcon />
            Kirjaudu ulos
          </Link>
        ) : (
          <Link to="/login" className="nav-button">
            <LoginIcon />
            Kirjaudu sisään
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
