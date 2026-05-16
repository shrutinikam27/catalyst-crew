import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar glass-effect">
        <div className="container nav-content">
          <div className="logo-section">
            <div className="logo-placeholder">CC</div>
            <span className="brand-name">Catalyst Crew</span>
          </div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#features">Features</a>
            <a href="#dashboard">Dashboard</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="nav-actions">
            <button className="btn btn-text">Login</button>
            <button className="btn btn-primary">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero container" id="home">
        <div className="hero-content animate-fade-in">
          <div className="badge">🚀 AI-Powered Collaboration Platform</div>
          <h1>Building The Future <br/>Through <span className="text-gradient">Collective Intelligence</span></h1>
          <p>Catalyst Crew integrates data, technology, and community collaboration to accelerate innovation, manage projects, and ensure team success.</p>
          <div className="hero-btns">
            <button className="btn btn-primary btn-lg">Start a Project</button>
            <button className="btn btn-outline btn-lg">View Crew Map</button>
          </div>
          <p className="hero-footer">Together, let's catalyze the next big thing.</p>
        </div>
        <div className="hero-visual animate-float">
          {/* Visual representation inspired by the image */}
          <div className="visual-card main-viz glass-effect">
            <div className="viz-header">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <div className="viz-content">
              <div className="pulse-circle"></div>
              <div className="inner-viz">
                <span>Crew Connectivity</span>
                <div className="bar-chart">
                  <div className="bar" style={{height: '60%'}}></div>
                  <div className="bar" style={{height: '80%'}}></div>
                  <div className="bar" style={{height: '40%'}}></div>
                  <div className="bar" style={{height: '90%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="features container" id="features">
        <div className="feature-card animate-fade-in">
          <div className="icon purple">📂</div>
          <h3>Project Hub</h3>
          <p>Centralize your workflow and manage complex projects with ease.</p>
        </div>
        <div className="feature-card animate-fade-in" style={{animationDelay: '0.2s'}}>
          <div className="icon green">📊</div>
          <h3>Live Metrics</h3>
          <p>Get real-time insights into your team's performance and project health.</p>
        </div>
        <div className="feature-card animate-fade-in" style={{animationDelay: '0.4s'}}>
          <div className="icon blue">🤝</div>
          <h3>Skill Exchange</h3>
          <p>Connect with experts and trade skills to grow your collective potential.</p>
        </div>
        <div className="feature-card animate-fade-in" style={{animationDelay: '0.6s'}}>
          <div className="icon orange">💰</div>
          <h3>Funding Portal</h3>
          <p>Access resources and investment opportunities for your crew's initiatives.</p>
        </div>
      </section>

      {/* Stats / Dashboard Preview */}
      <section className="stats-section container">
        <div className="stats-grid">
          <div className="stat-card glass-effect">
            <span className="stat-label">Active Projects</span>
            <span className="stat-value">124</span>
          </div>
          <div className="stat-card glass-effect">
            <span className="stat-label">Community Members</span>
            <span className="stat-value">45.2K</span>
          </div>
          <div className="stat-card glass-effect">
            <span className="stat-label">Resolved Milestones</span>
            <span className="stat-value">926</span>
          </div>
          <div className="stat-card glass-effect">
            <span className="stat-label">Avg. Response Time</span>
            <span className="stat-value">4.8h</span>
          </div>
        </div>
        
        <div className="emergency-banner">
          <div className="banner-content">
            <h3>Need Urgent Support?</h3>
            <p>Our mentor network is available 24/7 to help you resolve critical blockers.</p>
          </div>
          <button className="btn btn-white">Get Help Now</button>
        </div>
      </section>

      <footer className="footer">
        <p>Trusted by over 500+ Innovative Teams. Powered by Catalyst Intelligence.</p>
      </footer>
    </div>
  );
}

export default App;
