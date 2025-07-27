// src/SignupPage.js
import React, { useState } from "react";
import { auth, provider } from "../Firebase/Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import './SignUpPage.css';






function SignupPage() {
  const navigate=useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLogin, setIsLogin] = useState(true); // 👈 true = Login, false = Sign Up

  // Handle email login/signup
  const handleEmailAuth = async () => {
    if (!email || !password) {
      setMessageType("error");
      setMessage("Please enter both email and password.");
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        const user=auth.currentUser;
        const token=await user.getIdToken();
        Cookies.set("authToken", token, {expires:7});
        navigate('/Home',{replace:true})
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessageType("success");
        setMessage("Account created successfully!");
      }
    } catch (error) {
      let userMessage = "Something went wrong.";

      switch (error.code) {
        case "auth/user-not-found":
          userMessage = "Account not found.";
          break;
        case "auth/wrong-password":
          userMessage = "Incorrect password.";
          break;
        case "auth/email-already-in-use":
          userMessage = "Email already in use. Please login instead.";
          break;
        case "auth/invalid-email":
          userMessage = "Invalid email format.";
          break;
        case "auth/weak-password":
          userMessage = "Password should be at least 6 characters.";
          break;
        default:
          userMessage = "Error: " + error.message;
      }

      setMessageType("error");
      setMessage(userMessage);
    }
  };

  // Google Sign-in
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token=await user.getIdToken();
      Cookies.set('authToken',token,{expires:7})
      navigate('/Home', {replace:true})
    } catch (error) {
      let userMessage = "Google sign-in failed.";

      switch (error.code) {
        case "auth/popup-closed-by-user":
          userMessage = "Popup closed before sign-in.";
          break;
        case "auth/cancelled-popup-request":
          userMessage = "Another popup was already open.";
          break;
        case "auth/popup-blocked":
          userMessage = "Popup was blocked by the browser.";
          break;
        default:
          userMessage = error.message;
      }

      setMessageType("error");
      setMessage(userMessage);
    }
  };

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      navigate('/Home', { replace: true });  // 👈 replaces history so back button doesn't return to login
    }
  }, []);

  return (
    
    <div className="container-fluid mt-5 bg-container" style={{ maxWidth: "400px" }}>
       
      <h2 className="mb-4 text-center">
        {isLogin ? "Welcome Back" : "Create Account"}
      </h2>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="btn btn-primary w-100 mb-3" onClick={handleEmailAuth}>
        {isLogin ? "Sign In with Email" : "Sign Up with Email"}
      </button>

      <div className="text-center mb-3">or</div>

      <button className="btn btn-danger w-100" onClick={handleGoogleLogin}>
        Continue with Google
      </button>

      <p className="mt-3 text-center">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
          className="btn btn-link p-0"
        >
          {isLogin ? "Sign Up" : "Sign In"}
        </button>
      </p>

      {message && (
        <p
          className={`mt-4 text-center ${
            messageType === "success" ? "text-success" : "text-danger"
          }`}
        >
          {message}
        </p>
      )}
    </div>


        
  );
  
}

export default SignupPage;
