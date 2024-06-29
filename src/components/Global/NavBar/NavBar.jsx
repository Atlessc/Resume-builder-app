import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/resume-form">Create Resume</Link>
      <Link to="/editor">Edit Resume</Link>
    </nav>
  );
}

export default NavBar;
