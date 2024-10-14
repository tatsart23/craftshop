import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <div className="logo-wrap">
        <Link to="/" className="logo">
          <img src="/img/logo.png" alt="logo" />
        </Link>
      </div>
      <div className="links">
      <Link to="/" className="nav-button">Home</Link>
      <Link to="/about" className="nav-button">About</Link>
      <Link to="/store" className="nav-button">Store</Link>
      <Link to="/add" className="nav-button">Add</Link>
      </div>
    </nav>
  );
};

export default Navbar;
