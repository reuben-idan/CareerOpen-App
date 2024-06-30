// Navbar.js
import React, { useState } from 'react';

const Navbar = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleProfilePictureClick = () => {
    // Navigate to the profile page or open a dropdown menu
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <a className="navbar-brand" href="#">
          <img src="/logo.png" alt="CareerOpen" width="30" height="30" className="d-inline-block align-top" />
          CareerOpen
        </a>
        <div className="d-flex">
          <form className="d-flex">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-light" type="submit">Search</button>
          </form>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">My Network</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Jobs</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Messaging</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Notification</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Career Resources</a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user && user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="rounded-circle" width="30" height="30" />
                ) : (
                  'Me'
                )}
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href="#">Profile</a></li>
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><a className="dropdown-item" href="#">Logout</a></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Business
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href="#">Post a Job</a></li>
                <li><a className="dropdown-item" href="#">Manage Jobs</a></li>
                <li><a className="dropdown-item" href="#">Employer Dashboard</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;