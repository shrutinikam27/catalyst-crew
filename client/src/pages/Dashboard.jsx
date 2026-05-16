import React from 'react';
import { 
  LayoutDashboard, Map, AlertTriangle, MessageSquare, 
  BarChart2, Cpu, Bell, Shield, Settings, Search, User, 
  MapPin, Clock, Briefcase, Activity
} from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const pieData = [
    { name: 'Theft', value: 45, color: '#EF4444' },
    { name: 'Assault', value: 32, color: '#F59E0B' },
    { name: 'Accident', value: 21, color: '#10B981' },
    { name: 'Harassment', value: 18, color: '#3B82F6' },
    { name: 'Others', value: 12, color: '#8B5CF6' },
  ];

  const lineData = [
    { name: 'Mon', value: 25 }, { name: 'Tue', value: 50 },
    { name: 'Wed', value: 30 }, { name: 'Thu', value: 45 },
    { name: 'Fri', value: 80 }, { name: 'Sat', value: 50 },
    { name: 'Sun', value: 65 },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <Shield size={24} className="text-primary" />
          <div className="sidebar-brand">
            <h2>SafeLink</h2>
            <p>Urban Safety Platform</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active"><LayoutDashboard size={20} /> Dashboard</a>
          <a href="#" className="nav-item"><Map size={20} /> Live Map</a>
          <a href="#" className="nav-item"><AlertTriangle size={20} /> Incidents</a>
          <a href="#" className="nav-item"><MessageSquare size={20} /> Complaints</a>
          <a href="#" className="nav-item"><BarChart2 size={20} /> Analytics</a>
          <a href="#" className="nav-item"><Cpu size={20} /> AI Predictions</a>
          <a href="#" className="nav-item"><Bell size={20} /> SOS Alerts</a>
          <a href="#" className="nav-item"><Briefcase size={20} /> Authorities</a>
          <a href="#" className="nav-item"><Settings size={20} /> Settings</a>
        </nav>

      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="search-bar glass-panel">
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="Search Location, Area, Incident..." />
          </div>
          <div className="topbar-actions">
            <div className="notification-bell glass-panel">
              <Bell size={20} />
              <span className="badge-dot"></span>
            </div>
            <div className="user-profile glass-panel">
              <div className="avatar bg-blue-100">
                <User size={18} className="text-primary" />
              </div>
              <div className="user-info">
                <span className="user-name">Admin</span>
                <span className="user-role">Control Center</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard-scroll">
          {/* Stats Row */}
          <div className="stats-row">
            <div className="stat-card glass-panel">
              <div className="stat-icon bg-red-100"><AlertTriangle className="text-danger" size={20}/></div>
              <div className="stat-info">
                <span className="stat-label text-danger">Active Incidents</span>
                <span className="stat-value">128</span>
                <span className="stat-trend text-muted">+12% from yesterday</span>
              </div>
            </div>
            <div className="stat-card glass-panel">
              <div className="stat-icon bg-orange-100"><MessageSquare className="text-warning" size={20}/></div>
              <div className="stat-info">
                <span className="stat-label text-warning">Complaints</span>
                <span className="stat-value">342</span>
                <span className="stat-trend text-muted">+8% from yesterday</span>
              </div>
            </div>
            <div className="stat-card glass-panel">
              <div className="stat-icon bg-red-100"><Shield className="text-danger" size={20}/></div>
              <div className="stat-info">
                <span className="stat-label text-danger">High Risk Zones</span>
                <span className="stat-value">24</span>
                <span className="stat-trend text-muted">+5% from yesterday</span>
              </div>
            </div>
            <div className="stat-card glass-panel">
              <div className="stat-icon bg-blue-100"><Briefcase className="text-primary" size={20}/></div>
              <div className="stat-info">
                <span className="stat-label text-primary">Police Units</span>
                <span className="stat-value">28</span>
                <span className="stat-trend text-muted">Active in Field</span>
              </div>
            </div>
            <div className="stat-card glass-panel">
              <div className="stat-icon bg-green-100"><Clock className="text-success" size={20}/></div>
              <div className="stat-info">
                <span className="stat-label text-success">Response Time</span>
                <span className="stat-value">06:24</span>
                <span className="stat-trend text-muted">Avg. Time (min)</span>
              </div>
            </div>
          </div>

          {/* Middle Row */}
          <div className="middle-row">
            <div className="map-widget glass-panel">
              <div className="widget-header">
                <h3>Crime Heatmap</h3>
              </div>
              <div className="map-container">
                {/* Mock Map Background with CSS Gradients for Heatmap Dots */}
                <div className="heat-dot" style={{ top: '30%', left: '40%', '--dot-color': 'rgba(239, 68, 68, 0.6)', transform: 'scale(1.5)' }}></div>
                <div className="heat-dot" style={{ top: '50%', left: '60%', '--dot-color': 'rgba(239, 68, 68, 0.8)', transform: 'scale(2)' }}></div>
                <div className="heat-dot" style={{ top: '20%', left: '70%', '--dot-color': 'rgba(245, 158, 11, 0.6)', transform: 'scale(1.2)' }}></div>
                <div className="heat-dot" style={{ top: '70%', left: '30%', '--dot-color': 'rgba(16, 185, 129, 0.5)', transform: 'scale(1)' }}></div>
                
                {/* Map Grid Lines */}
                <div className="map-grid"></div>
                <div className="map-labels">
                  <span style={{top: '35%', left: '35%'}}>BANER</span>
                  <span style={{top: '48%', left: '55%'}}>PUNE</span>
                  <span style={{top: '65%', left: '75%'}}>HADAPSAR</span>
                </div>
              </div>
              <div className="map-legend">
                <span><div className="legend-dot bg-success"></div> Low Risk</span>
                <span><div className="legend-dot bg-warning"></div> Medium Risk</span>
                <span><div className="legend-dot bg-danger"></div> High Risk</span>
              </div>
            </div>

            <div className="right-sidebar">
              <div className="ai-risk-widget glass-panel">
                <h3>AI RISK PREDICTION</h3>
                <div className="risk-location">Shivajinagar, Pune &gt;</div>
                <div className="risk-score">
                  <span className="score-value text-danger">85<span className="text-sm">%</span></span>
                  <span className="score-label text-danger">High Risk</span>
                </div>
                <p className="risk-trend text-muted text-sm">Risk Trend: High risk expected next 3 days</p>
                <div className="mini-chart">
                  <ResponsiveContainer width="100%" height={50}>
                    <LineChart data={lineData}>
                      <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} dot={{r:3, fill:'#EF4444'}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="recent-alerts glass-panel">
                <div className="widget-header">
                  <h3>RECENT ALERTS</h3>
                </div>
                <div className="alerts-list">
                  <div className="alert-item">
                    <div className="alert-dot bg-danger"></div>
                    <div className="alert-content">
                      <h4>High Crime Activity</h4>
                      <p>Shivajinagar</p>
                    </div>
                    <span className="alert-time">10 min ago</span>
                  </div>
                  <div className="alert-item">
                    <div className="alert-dot bg-warning"></div>
                    <div className="alert-content">
                      <h4>Suspicious Activity</h4>
                      <p>Kharadi</p>
                    </div>
                    <span className="alert-time">25 min ago</span>
                  </div>
                  <div className="alert-item">
                    <div className="alert-dot bg-success"></div>
                    <div className="alert-content">
                      <h4>Traffic Accident</h4>
                      <p>Kothrud</p>
                    </div>
                    <span className="alert-time">40 min ago</span>
                  </div>
                </div>
                <button className="btn-view-all text-primary text-sm">View All Alerts</button>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="bottom-row">
            <div className="incidents-overview glass-panel">
              <h3>INCIDENTS OVERVIEW</h3>
              <div className="pie-container">
                <ResponsiveContainer width="50%" height={150}>
                  <PieChart>
                    <Pie data={pieData} innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  {pieData.map((entry, i) => (
                    <div key={i} className="pie-legend-item">
                      <div className="flex items-center gap-2">
                        <span className="legend-dot" style={{backgroundColor: entry.color}}></span>
                        <span className="text-sm">{entry.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="complaints-overview glass-panel">
              <div className="widget-header">
                <h3>COMPLAINTS OVERVIEW</h3>
                <span className="text-sm text-muted">This Week</span>
              </div>
              <div className="line-chart-container" style={{height: '140px'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{r: 4, fill: '#3B82F6'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="top-categories glass-panel">
              <h3>TOP COMPLAINT CATEGORIES</h3>
              <div className="category-list">
                <div className="category-item">
                  <div className="cat-info"><span className="text-sm">Street Light Not Working</span><span className="text-sm">98</span></div>
                  <div className="progress-bg"><div className="progress-fill bg-primary" style={{width: '90%'}}></div></div>
                </div>
                <div className="category-item">
                  <div className="cat-info"><span className="text-sm">Road Damage</span><span className="text-sm">76</span></div>
                  <div className="progress-bg"><div className="progress-fill bg-success" style={{width: '70%'}}></div></div>
                </div>
                <div className="category-item">
                  <div className="cat-info"><span className="text-sm">Garbage/Overflow</span><span className="text-sm">62</span></div>
                  <div className="progress-bg"><div className="progress-fill bg-warning" style={{width: '50%'}}></div></div>
                </div>
                <div className="category-item">
                  <div className="cat-info"><span className="text-sm">Water Leakage</span><span className="text-sm">41</span></div>
                  <div className="progress-bg"><div className="progress-fill bg-danger" style={{width: '35%'}}></div></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
