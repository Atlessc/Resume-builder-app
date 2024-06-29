import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import ResumeForm from './components/ResumeForm/ResumeForm';
import Editor from './components/Editor/Editor';
import NavBar from './components/Global/NavBar/NavBar';
import Footer from './components/Global/Footer/Footer';
// import CookieConsent from './components/CookieConsent';

function App() {
  return (
    <div>
      <NavBar />
      {/* <CookieConsent /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume-form" element={<ResumeForm />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
