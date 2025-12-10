import React from 'react';
import './Logo3D.css';

const Logo3D = () => {
  return (
    <div className="logo-3d-container">
      <div className="logo-3d">
        <div className="cube">
          <div className="face front">E</div>
          <div className="face back">F</div>
          <div className="face right">A</div>
          <div className="face left"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
        </div>
      </div>
      <div className="logo-text">
        <span className="main-text">EFA STORE</span>
        <span className="sub-text">Performance & Style</span>
      </div>
    </div>
  );
};

export default Logo3D;
