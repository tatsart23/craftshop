import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav>
        <h1>Navbar</h1>
        <div className="links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/store">Store</Link>
            <Link to="/add">Add</Link>
        </div>
    </nav>
  )
}

export default Navbar