import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to Resume Builder</h1>
      <Link to="/resume-form">
        <button>Start Creating Your Resume</button>
      </Link>
    </div>
  );
}

export default Home;
