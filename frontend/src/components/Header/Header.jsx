import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo à gauche */}
        <div className="logo">
          <img src="/logo.png" alt="POC Logo" className="logo-img" />
          <span className="logo-text">Professor Oak Challenge</span>
        </div>

        {/* Menu navigation */}
        <nav className="nav-menu">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/" className="nav-link">Home</a>
            </li>
            <li className="nav-item">
              <a href="/guides" className="nav-link">Guides</a>
            </li>
            <li className="nav-item">
              <a href="/auth" className="nav-link">Login</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
