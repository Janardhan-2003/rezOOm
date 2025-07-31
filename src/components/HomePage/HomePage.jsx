import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDiceD20 } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import { AiFillThunderbolt } from "react-icons/ai";
import { GrUserExpert } from "react-icons/gr";
import { MdOutlineMail } from "react-icons/md";
import { FaLinkedin,FaGithub,FaDownload   } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Header from '../Header/Header'
import './HomePage.css';

const Home = () => {
  const date=new Date()
  const currentYear=date.getFullYear()

  const navigate=useNavigate()
  const handleAnalyzeCheck=()=>{
    navigate('/Analyze')
  }

  return (
    <>
    <Header />
    <div className="home-container">
      {/* Hero Section */}
      <section id='home' className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Elevate Your Career with 
            <span className="gradient-text"> AI-Powered Resume Analysis</span>
          </h1>
          <p className="hero-description">
            Get instant feedback, optimization suggestions, and ATS compatibility scores 
            to make your resume stand out from the crowd.
          </p>
          <button onClick={handleAnalyzeCheck} className="analyze-btn">
            <FaDiceD20 />
            Analyze Your Resume
          </button>
        </div>
        <div className="hero-visual">
          <div className="floating-card">
            <div className="card-header">Resume.pdf</div>
            <div className="card-content">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <p>ATS Score: 94%</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="about-section">
        <div className="about-container">
          <h2 className="section-title">About</h2>
          <div className="about-content">
            <div className="about-text">
              <p className="about-description">
              <strong>ReZoom</strong> is your intelligent resume enhancement assistant designed to help job seekers stand out in a competitive job market. Built with AI-powered technologies like <strong>Google Gemini</strong>, ReZoom analyzes your existing resume, compares it with a target job description, and gives you personalized feedback including ATS scores, matched and missing keywords, and expert improvement tips.
              </p>
              <h2 className="section-title">What you get</h2>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">
                    <SiTicktick />
                  </div>
                  <span>ATS Optimization</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                  <AiFillThunderbolt />
                  </div>
                  <span>Instant Analysis</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                  <GrUserExpert />
                  </div>
                  <span>Expert Recommendations</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                  <FaDownload />
                  </div>
                  <span>Download Sample Resume</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="footer-container">
          <div className='footer-contacts'>

            <a href='mailto:jr.kokatam09@gmail.com' target='_black' rel="noopener noreferrer"
  className="social-link"
  title="Send Email"><MdOutlineMail /></a>



<a href='https://www.linkedin.com/in/kokatam-janardhan-reddy/' target='_black' rel="noopener noreferrer"
  className="social-link"
  title="Send Email"><FaLinkedin /></a>

<a href='https://github.com/Janardhan-2003' target='_black' rel="noopener noreferrer"
  className="social-link"
  title="Send Email"><FaGithub /></a>

<a href='https://x.com/Jana_kokatam9?t=e34QlwSXVNhYfVhbaPM5Vg&s=09' target='_black' rel="noopener noreferrer"
  className="social-link"
  title="Send Email"><FaXTwitter /></a>

          
          
          
          </div>
          
            <p className="footer-bottom">&copy; {currentYear} rezOOm. All rights reserved.</p>
          
        </div>
      </footer>
    </div>
    </>
  );
};

export default Home;