import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/HomePage';
import Login from './pages/LoginSignupPage';
import Profile from './pages/UserProfile';
import Feed from './pages/NewsFeed';
import SignUp from './pages/SignupPage';
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
            {/* Diğer yollarınız buraya gelebilir */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
