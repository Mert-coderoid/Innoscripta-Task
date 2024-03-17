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


import './styles/App.css';

function App() {
  const newsLocations = [
    { coordinates: { latitude: 40.7128, longitude: -74.0060 } }, // New York
    { coordinates: { latitude: 34.0522, longitude: -118.2437 } }, // Los Angeles
    // Daha fazla konum eklenebilir
  ];

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
            <Route path="/globe" element={
                <Globe newsLocations={newsLocations} />
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;