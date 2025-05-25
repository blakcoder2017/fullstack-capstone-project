import React from 'react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">GiftLink</a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          {/* Task 1: Add links to Home and Gifts */}
          <li className="nav-item">
            <a className="nav-link" href="/home.html">Home</a> {/* Link to home page */}
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/app">Gifts</a> {/* Link to MainPage */}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
