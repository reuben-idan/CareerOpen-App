import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ profilePicture, onProfilePictureUpload }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          <img src="logo.png" alt="Website Logo" />
        </Link>
        <div className="search-bar">
          <input type="text" placeholder="Search" />
          <button className="search-button">Search</button>
        </div>
      </div>
      <div className="navbar-right">
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/network">My Network</Link></li>
          <li><Link to="/jobs">Jobs</Link></li>
          <li><Link to="/messages">Messaging and Notification</Link></li>
          <li><Link to="/resources">Career Resources</Link></li>
          <li>
            <div className="profile-dropdown">
              <Link to="/profile" className="profile-picture">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" />
                ) : (
                  <i className="fas fa-user-circle"></i>
                )}
              </Link>
              <ul className="dropdown-menu">
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/settings">Settings</Link></li>
                <li><Link to="/logout">Logout</Link></li>
                <li>
                  <div className="business-dropdown">
                    <Link to="/business">Business</Link>
                    <ul className="dropdown-menu">
                      <li><Link to="/business/dashboard">Dashboard</Link></li>
                      <li><Link to="/business/jobs">Post Jobs</Link></li>
                      <li><Link to="/business/analytics">Analytics</Link></li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;