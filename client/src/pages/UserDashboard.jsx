import React, { useState, useRef } from 'react';
import { 
  Home, Map, AlertTriangle, MessageSquare, Shield, PieChart, 
  LineChart, Bell, Heart, Users, User, Settings, Search,
  MapPin, CloudSun, ShieldAlert, Navigation, FileText,
  Ambulance, Flame, Phone
} from 'lucide-react';
import './UserDashboard.css';

const UserDashboard = () => {
  const [sosClicks, setSosClicks] = useState(0);
  const [showSosOptions, setShowSosOptions] = useState(false);
  const clickTimeoutRef = useRef(null);

  const handleSosClick = () => {
    setSosClicks(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setShowSosOptions(true);
        return 0; // reset
      }
      return newCount;
    });

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      setSosClicks(0);
    }, 1500); // Reset if gap is more than 1.5 seconds
  };

  const handleEmergencySelect = (type) => {
    // In the future, this will dispatch to volunteers/authorities
    alert(`SOS Triggered for: ${type}\n\nNearby certified volunteers have been notified and will arrive immediately, followed by official emergency services.`);
    setShowSosOptions(false);
  };

  return (
    <div className="user-dashboard-layout">
      {/* Sidebar */}
      <aside className="user-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon-wrapper">
            <ShieldAlert className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <h2>SafeLink</h2>
            <p>Together for a Safer City</p>
          </div>
        </div>

        <nav className="user-sidebar-nav">
          <a href="#" className="nav-item active"><Home size={18} /> Dashboard</a>
          <a href="#" className="nav-item"><Map size={18} /> Risk Map</a>
          <a href="#" className="nav-item"><AlertTriangle size={18} /> Emergency</a>
          <a href="#" className="nav-item"><FileText size={18} /> Report Issue</a>
          <a href="#" className="nav-item"><Shield size={18} /> Women Safety</a>
          <a href="#" className="nav-item"><PieChart size={18} /> Complaints Analytics</a>
          <a href="#" className="nav-item"><LineChart size={18} /> Predictive Analytics</a>
          <a href="#" className="nav-item"><Bell size={18} /> Alerts & Notifications</a>
          <a href="#" className="nav-item"><Heart size={18} /> Citizen Safety Tips</a>
          <a href="#" className="nav-item"><Users size={18} /> Authorities Panel</a>
          <a href="#" className="nav-item"><Settings size={18} /> Profile & Settings</a>
        </nav>

        <div className="sidebar-promo">
          <h4>Together,<br/>we can make<br/>our City Safer!</h4>
          {/* A silhouette of skyline placeholder */}
          <div className="promo-bg"></div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="user-main-content">
        {/* Topbar */}
        <header className="user-topbar">
          <div className="location-weather">
            <div className="location">
              <MapPin size={16} className="text-gray-500" />
              <span>City, State</span>
            </div>
            <div className="weather">
              <CloudSun size={18} className="text-yellow-500" />
              <div className="weather-info">
                <span className="temp">28°C</span>
                <span className="desc">Partly Cloudy</span>
              </div>
            </div>
          </div>
          
          <div className="search-container">
            <input type="text" placeholder="Search for areas, incidents, resources..." />
            <Search size={16} className="search-icon" />
          </div>

          <div className="topbar-right">
            <div className="notification-icon">
              <Bell size={20} />
              <span className="badge">3</span>
            </div>
            <div className="user-profile">
              <div className="avatar">
                <User size={18} />
              </div>
              <div className="user-details">
                <span className="name">Hi, User</span>
                <span className="role">Citizen</span>
              </div>
            </div>
          </div>
        </header>

        <div className="scrollable-content">
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="banner-content">
              <div className="banner-icon-wrapper">
                <ShieldAlert size={30} color="white" />
              </div>
              <div className="banner-text">
                <p>Welcome to</p>
                <h1>SafeLink</h1>
                <p className="subtitle">Smart Urban Risk Mapping & Citizen Safety Platform</p>
              </div>
            </div>
            <div className="banner-cityscape"></div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <div className="action-card cursor-pointer relative hover:ring-2 hover:ring-red-400 transition-all select-none" onClick={handleSosClick}>
              <div className="icon-circle bg-red"><AlertTriangle size={20} color="white" /></div>
              <div className="action-text">
                <h4>Emergency SOS</h4>
                <p>Triple click to activate</p>
              </div>
              {sosClicks > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-red-500/50 border-2 border-white">
                  {sosClicks}
                </div>
              )}
            </div>
            <div className="action-card">
              <div className="icon-circle bg-purple"><MapPin size={20} color="white" /></div>
              <div className="action-text">
                <h4>Share Live Location</h4>
                <p>Share with your contacts</p>
              </div>
            </div>
            <div className="action-card">
              <div className="icon-circle bg-orange"><MessageSquare size={20} color="white" /></div>
              <div className="action-text">
                <h4>Report an Issue</h4>
                <p>Crime or Civic Issue</p>
              </div>
            </div>
            <div className="action-card">
              <div className="icon-circle bg-blue"><Map size={20} color="white" /></div>
              <div className="action-text">
                <h4>View Risk Map</h4>
                <p>Check safe & risky areas</p>
              </div>
            </div>
          </div>

          {/* Overview Section */}
          <div className="section-header">
            <h3>City Safety Overview</h3>
            <select className="dropdown"><option>Today</option></select>
          </div>
          
          <div className="overview-stats">
            <div className="stat-box">
              <div className="stat-icon-wrapper bg-indigo-light">
                <Shield className="text-indigo" size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-title">Total Complaints</p>
                <h3 className="stat-val">1,248</h3>
                <p className="stat-trend text-green">↑ +12% from yesterday</p>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon-wrapper bg-orange-light">
                <Bell className="text-orange" size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-title">Active Emergencies</p>
                <h3 className="stat-val">32</h3>
                <p className="stat-trend text-green">↓ -8% from yesterday</p>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon-wrapper bg-purple-light">
                <MapPin className="text-purple" size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-title">High Risk Zones</p>
                <h3 className="stat-val">18</h3>
                <p className="stat-trend text-red">↑ +3 new zones today</p>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon-wrapper bg-green-light">
                <Users className="text-green-icon" size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-title">Resolved Issues</p>
                <h3 className="stat-val">987</h3>
                <p className="stat-trend text-green">↑ +15% from yesterday</p>
              </div>
            </div>
          </div>

          {/* Map and Alerts Row */}
          <div className="middle-layout">
            <div className="map-section card">
              <div className="map-header">
                <h3>Live Risk Map</h3>
                <div className="map-legend">
                  <span><div className="dot dot-green"></div> Low Risk</span>
                  <span><div className="dot dot-orange"></div> Moderate</span>
                  <span><div className="dot dot-red"></div> High Risk</span>
                </div>
              </div>
              <div className="map-placeholder">
                {/* Simulated map background with heat spots */}
                <div className="simulated-map">
                  <div className="heat-spot spot-red" style={{top: '40%', left: '70%'}}></div>
                  <div className="heat-spot spot-red" style={{top: '70%', left: '40%'}}></div>
                  <div className="heat-spot spot-orange" style={{top: '35%', left: '35%'}}></div>
                  <div className="heat-spot spot-green" style={{top: '55%', left: '20%'}}></div>
                  
                  <span className="map-label" style={{top: '25%', left: '25%'}}>Baner</span>
                  <span className="map-label" style={{top: '25%', left: '40%'}}>Aundh</span>
                  <span className="map-label" style={{top: '50%', left: '45%', fontWeight: 'bold'}}>City Center</span>
                  <span className="map-label" style={{top: '75%', left: '28%'}}>Kothrud</span>
                  <span className="map-label" style={{top: '35%', left: '72%'}}>Kharadi</span>
                  <span className="map-label" style={{top: '60%', left: '75%'}}>Hadapsar</span>
                </div>
                <div className="map-controls">
                  <button>+</button>
                  <button>-</button>
                  <button><Navigation size={14}/></button>
                </div>
                <button className="btn-view-full">View Full Map →</button>
              </div>
            </div>

            <div className="right-column">
              <div className="recent-alerts card">
                <div className="card-header">
                  <h3>Recent Alerts</h3>
                  <a href="#">View All</a>
                </div>
                <div className="alerts-list">
                  <div className="alert-item">
                    <div className="alert-icon bg-red-light text-red"><AlertTriangle size={16}/></div>
                    <div className="alert-details">
                      <h4>High crime activity reported in Hadapsar</h4>
                      <p>Today, 10:30 AM <span className="tag tag-red">High Risk</span></p>
                    </div>
                  </div>
                  <div className="alert-item">
                    <div className="alert-icon bg-orange-light text-orange"><AlertTriangle size={16}/></div>
                    <div className="alert-details">
                      <h4>Heavy traffic accident near Katraj</h4>
                      <p>Today, 09:15 AM <span className="tag tag-orange">Moderate</span></p>
                    </div>
                  </div>
                  <div className="alert-item">
                    <div className="alert-icon bg-blue-light text-blue"><Shield size={16}/></div>
                    <div className="alert-details">
                      <h4>Rain alert for City - Stay Safe!</h4>
                      <p>Today, 08:00 AM <span className="tag tag-blue">Info</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="emergency-contacts card">
                <div className="card-header">
                  <div className="flex items-center gap-2">
                    <div className="icon-box bg-blue text-white rounded"><Phone size={14}/></div>
                    <h3>Quick Emergency Contacts</h3>
                  </div>
                  <a href="#">View All</a>
                </div>
                <div className="contacts-grid">
                  <div className="contact-item">
                    <div className="contact-icon bg-blue-light text-blue"><Shield size={18}/></div>
                    <div className="contact-info">
                      <p>Police</p>
                      <strong>100 / 112</strong>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon bg-indigo-light text-indigo"><Heart size={18}/></div>
                    <div className="contact-info">
                      <p>Women Helpline</p>
                      <strong>1091</strong>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon bg-blue-light text-blue"><Ambulance size={18}/></div>
                    <div className="contact-info">
                      <p>Ambulance</p>
                      <strong>108</strong>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon bg-orange-light text-orange"><Flame size={18}/></div>
                    <div className="contact-info">
                      <p>Fire Brigade</p>
                      <strong>101</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="safety-tip card bg-indigo-gradient">
                <Shield className="tip-watermark" size={100} />
                <h3>Safety Tip of the Day</h3>
                <p>Always share your live location with trusted contacts while traveling.</p>
                <div className="carousel-dots">
                  <span className="active"></span><span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Explore More Row */}
          <div className="explore-more">
            <h3>Explore More</h3>
            <div className="explore-grid">
              <div className="explore-card">
                <div className="icon-wrapper text-indigo bg-indigo-light"><Shield size={20} /></div>
                <span>Women Safety</span>
              </div>
              <div className="explore-card">
                <div className="icon-wrapper text-green-icon bg-green-light"><Navigation size={20} /></div>
                <span>Safe Routes</span>
              </div>
              <div className="explore-card">
                <div className="icon-wrapper text-blue bg-blue-light"><MapPin size={20} /></div>
                <span>Nearby Help</span>
              </div>
              <div className="explore-card">
                <div className="icon-wrapper text-red bg-red-light"><Map size={20} /></div>
                <span>Crime Heatmap</span>
              </div>
              <div className="explore-card">
                <div className="icon-wrapper text-orange bg-orange-light"><MessageSquare size={20} /></div>
                <span>Civic Issues</span>
              </div>
              <div className="explore-card">
                <div className="icon-wrapper text-purple bg-purple-light"><User size={20} /></div>
                <span>Anonymous Report</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* SOS Triple-Click Modal Overlay */}
      {showSosOptions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-[0_0_50px_rgba(220,38,38,0.3)] border border-red-200 dark:border-red-900/50 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
              <AlertTriangle size={48} className="text-red-600 dark:text-red-500 relative z-10" />
            </div>
            
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3">EMERGENCY SOS</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Select the exact emergency. Nearby certified volunteers will be notified instantly to provide rapid response before official authorities arrive.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleEmergencySelect('Fire')} className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border-2 border-orange-200 bg-orange-50 hover:bg-orange-500 hover:border-orange-600 hover:text-white text-orange-700 transition-all active:scale-95 group shadow-sm">
                <Flame size={36} className="group-hover:animate-bounce" />
                <span className="font-bold text-lg tracking-wide">FIRE</span>
              </button>
              
              <button onClick={() => handleEmergencySelect('Crime')} className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-600 hover:border-blue-700 hover:text-white text-blue-700 transition-all active:scale-95 group shadow-sm">
                <ShieldAlert size={36} className="group-hover:animate-bounce" />
                <span className="font-bold text-lg tracking-wide">CRIME</span>
              </button>
              
              <button onClick={() => handleEmergencySelect('Medical')} className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border-2 border-green-200 bg-green-50 hover:bg-green-600 hover:border-green-700 hover:text-white text-green-700 transition-all active:scale-95 group shadow-sm">
                <Ambulance size={36} className="group-hover:animate-bounce" />
                <span className="font-bold text-lg tracking-wide">MEDICAL</span>
              </button>
              
              <button onClick={() => handleEmergencySelect('Accident')} className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-600 hover:border-purple-700 hover:text-white text-purple-700 transition-all active:scale-95 group shadow-sm">
                <AlertTriangle size={36} className="group-hover:animate-bounce" />
                <span className="font-bold text-lg tracking-wide">ACCIDENT</span>
              </button>
            </div>
            
            <button onClick={() => setShowSosOptions(false)} className="mt-8 px-6 py-2 rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300 font-semibold transition-colors">
              Cancel Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
