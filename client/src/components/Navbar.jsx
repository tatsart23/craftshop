import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";


const Navbar = () => {

  const auth = useAuth();

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

      {auth.token ? (
        <Link to="/add" className="nav-button">Add</Link> //Näytetään linkki vain jos käyttäjä on kirjautunut sisään
      ) : null}

      {auth.token ? (
        <Link to="/logout" className="nav-button">Logout</Link> //näytetään logout jos käyttäjä on kirjautunut sisään ja piilotetaan login ja vice versa.
      ) : <Link to="/login" className="nav-button">Login</Link>} 
      </div>
    </nav>
  );
};

export default Navbar;
