import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/Firebase';
import Cookies from 'js-cookie';
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
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17H8" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 9H9H8" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="logo-text">ResumeAnalyzer</span>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
        <button className="nav-link" onClick={() => scrollToSection("home")}>
            Home
          </button>
          <button className="nav-link" onClick={() => scrollToSection("about")}>
            About Me
          </button>
          <button className="nav-link" onClick={() => scrollToSection("contact")}>
            Contact
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;