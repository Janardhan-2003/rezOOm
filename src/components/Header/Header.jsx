import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/Firebase';
import Cookies from 'js-cookie';
import { IoTelescopeSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";

import './Header.css';

const Header = () => {
  const navigate=useNavigate()
  const location=useLocation()

  const scrollToSection = (id) => {
    // If not on home page, first navigate there
    if (location.pathname !== "/Home") {
      navigate('/Home');

      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100); // short delay to ensure DOM renders
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    signOut(auth)
    .then(()=>{
      Cookies.remove('authToken');
      window.location.href='/';
    })
    .catch(error=>{
      console.error('Logout Error:', error)
    })
  };


  

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo/Icon Section */}
        <div className="logo-section">
          
         
          
          <span className="logo-text">rezOOm</span>
          <IoTelescopeSharp color='white'/>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
        <button className="nav-link" onClick={() => scrollToSection("home")}>
            Home
          </button>
          <button className="nav-link" onClick={() => scrollToSection("about")}>
            About 
          </button>
         
          <button onClick={handleLogout} className="logout-btn">
          <MdLogout />
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;