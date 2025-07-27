import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SignUpPage from './components/SignUpPage/SignUpPage';
import HomePage from './components/HomePage/HomePage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import PublicRoute  from './components/PublicRoute/PublicRoute';
import ResumeAnalyzer from './components/ResumeAnalyzer/ResumeAnalyzer';

function App() {
  return (
    <Router>

      <Routes>

        <Route path='/' element={
          <PublicRoute>
<SignUpPage/>

          </PublicRoute>
          } />
        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
<Route path="/Analyze" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />

      </Routes>
    </Router>
    
  );
}

export default App;
