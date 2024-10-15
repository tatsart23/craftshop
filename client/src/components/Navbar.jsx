import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import HomeIcon from '@mui/icons-material/Home';
import HelpIcon from '@mui/icons-material/Help';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

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
        <Link to="/" className="nav-button"><HomeIcon />Home</Link>
        <Link to="/about" className="nav-button"><HelpIcon />About</Link>
        <Link to="/store" className="nav-button"><StorefrontIcon />Store</Link>

        {auth.token ? (
          <Link to="/add" className="nav-button"><AddCircleIcon />Add</Link> // Näytetään linkki vain jos käyttäjä on kirjautunut sisään
        ) : null}

        {auth.token ? (
          <Link to="/logout" className="nav-button"><LogoutIcon />Logout</Link> // Näytetään logout jos käyttäjä on kirjautunut sisään ja piilotetaan login ja vice versa.
        ) : <Link to="/login" className="nav-button"><LoginIcon/>Log in</Link>}
      </div>
    </nav>
  );
};

export default Navbar;