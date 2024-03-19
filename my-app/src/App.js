// App.js düzenlemesi
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/HomePage';
import Login from './pages/LoginSignupPage';
import Profile from './pages/UserProfile';
import Feed from './pages/NewsFeed';
import SignUp from './pages/SignupPage';
import Globe from './pages/Globe';
// import { Canvas } from '@react-three/fiber';
import Sahne from './pages/BasitKure';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TestToast from './pages/toast';


import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/globe" element={<Globe />} />
            <Route path="/toast" element={<TestToast />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;