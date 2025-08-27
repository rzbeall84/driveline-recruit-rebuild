import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DriversSection from './DriversSection';

const Dashboard = ({ user, onSignOut }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [driverFilter, setDriverFilter] = useState({ type: 'all', value: null });
  const [jobs, setJobs] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Load sample data
    setJobs([
      {
        id: 1881,
        company: 'Walmart - Opelika, AL',
        position: 'Class A Driver - Home Daily',
        location: 'Opelika, Alabama',
        type: 'Company Solo',
        schedule: 'Home Daily',
        date: '8/12/2025',
        hot: true
      }
    ]);

    setUpdates([
      {
        id: 1,
        title: 'FINALLY UP AND GOING!',
        content: 'Thank you all for your patience :)',
        date: '8/21/2025',
        likes: 2,
        comments: 1
      }
    ]);

    setNews([
      {
        id: 1,
        title: 'FMCSA Modifies Waiver for Use of Paper Medical Examiner\'s Certificate',
        date: '8/21/2025'
      }
    ]);
  }, []);

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: '🏠',
      hasDropdown: false
    },
    { 
      id: 'drivers', 
      label: 'Drivers', 
      icon: '🚛',
      hasDropdown: true,
      dropdownItems: [
        { id: 'all-drivers', label: 'All Drivers', icon: '👥', filterType: 'all' },
        { id: 'my-drivers', label: 'My Drivers', icon: '👤', filterType: 'my' },
        { id: 'awaiting-safety-check', label: 'Awaiting Safety Check', icon: '⏳', filterType: 'status', filterValue: 'Awaiting Safety Check' },
        { id: 'safety-processing', label: 'Safety Processing', icon: '⚙️', filterType: 'status', filterValue: 'Safety Processing' },
        { id: 'carrier-safety-review', label: 'Carrier Safety Review', icon: '🔍', filterType: 'status', filterValue: 'Carrier Safety Review' },
        { id: 'submitted-to-carrier', label: 'Submitted to Carrier', icon: '📤', filterType: 'status', filterValue: 'Submitted to Carrier' },
        { id: 'hired', label: 'Hired', icon: '✅', filterType: 'status', filterValue: 'Hired' },
        { id: 'closed-files', label: 'Closed Files', icon: '📁', filterType: 'status', filterValue: 'Closed Files' }
      ]
    },
    { 
      id: 'jobs', 
      label: 'Jobs', 
      icon: '💼',
      hasDropdown: false
    },
    { 
      id: 'carriers', 
      label: 'Carriers', 
      icon: '🏢',
      hasDropdown: false
    },
    { 
      id: 'recruiters', 
      label: 'Recruiters', 
      icon: '👥',
      hasDropdown: true,
      dropdownItems: [
        { id: 'recruiter-roster', label: 'Recruiter Roster', icon: '👥' },
        { id: 'recruiter-performance', label: 'Recruiter Performance', icon: '📈' },
        { id: 'recruiter-commissions', label: 'Recruiter Commissions', icon: '💰' },
        { id: 'recruiter-training', label: 'Recruiter Training', icon: '🎓' }
      ]
    },
    { 
      id: 'admin', 
      label: 'Admin', 
      icon: '⚙️',
      hasDropdown: true,
      dropdownItems: [
        { id: 'recruiter-roster', label: 'Recruiter Roster', icon: '👥' },
        { id: 'admin-roster', label: 'Admin Roster', icon: '👨‍💼' },
        { id: 'email-templates', label: 'Email Templates', icon: '📧' },
        { id: 'carrier-files', label: 'Carrier Files', icon: '📁' },
        { id: 'user-management', label: 'User Management', icon: '👤' },
        { id: 'backup-management', label: 'Backup Management', icon: '💾' },
        { id: 'billing-history', label: 'Billing History', icon: '💳' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
      ]
    },
    { 
      id: 'operations', 
      label: 'Operations', 
      icon: '📊',
      hasDropdown: true,
      dropdownItems: [
        { id: 'dispatch', label: 'Dispatch', icon: '📡' },
        { id: 'load-management', label: 'Load Management', icon: '📦' },
        { id: 'route-planning', label: 'Route Planning', icon: '🗺️' },
        { id: 'fleet-tracking', label: 'Fleet Tracking', icon: '🚛' }
      ]
    },
    { 
      id: 'safety', 
      label: 'Safety', 
      icon: '🛡️',
      hasDropdown: true,
      dropdownItems: [
        { id: 'safety-reports', label: 'Safety Reports', icon: '📋' },
        { id: 'incident-management', label: 'Incident Management', icon: '⚠️' },
        { id: 'compliance-tracking', label: 'Compliance Tracking', icon: '✅' },
        { id: 'safety-training', label: 'Safety Training', icon: '🎓' }
      ]
    }
  ];

  const toggleDropdown = (itemId) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  const handleSectionClick = (sectionId, hasDropdown) => {
    if (hasDropdown) {
      toggleDropdown(sectionId);
    } else {
      setActiveSection(sectionId);
      setActiveDropdown(null);
    }
  };

  const handleDropdownItemClick = (itemId, dropdownItem) => {
    // Handle driver filters differently
    if (dropdownItem && dropdownItem.filterType) {
      setActiveSection('drivers');
      setDriverFilter({
        type: dropdownItem.filterType,
        value: dropdownItem.filterValue || null
      });
    } else {
      setActiveSection(itemId);
    }
    setActiveDropdown(null);
  };

  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening in your recruiting world today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hot Jobs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">📈</span>
            <h2 className="text-xl font-semibold text-gray-800">Hot Jobs</h2>
          </div>
          
          {jobs.map(job => (
            <div key={job.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <span className="text-orange-500 mr-2">🔥</span>
                  <h3 className="font-semibold text-gray-800">{job.company}</h3>
                  {job.hot && <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs">HOT</span>}
                </div>
                <span className="text-blue-600 font-semibold">Job #{job.id}</span>
              </div>
              
              <h4 className="font-medium text-gray-700 mb-2">{job.position}</h4>
              
              <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
                <span className="flex items-center">📍 {job.location}</span>
                <span className="flex items-center">🚛 {job.type}</span>
                <span className="flex items-center">🏠 {job.schedule}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{job.date}</span>
                <div className="space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                    View
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            View All Jobs →
          </button>
        </div>

        {/* DriveLine Updates */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">📅</span>
            <h2 className="text-xl font-semibold text-gray-800">DriveLine Updates</h2>
          </div>
          
          {updates.map(update => (
            <div key={update.id} className="border rounded-lg p-4 mb-4 bg-blue-50">
              <h3 className="font-semibold text-gray-800 mb-2">{update.title}</h3>
              <p className="text-gray-600 mb-3">{update.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{update.date}</span>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">❤️ {update.likes}</span>
                  <span className="flex items-center">💬 {update.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* This Month's Top Recruiter */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">🏆</span>
            <h2 className="text-xl font-semibold text-gray-800">This Month's Top Recruiter</h2>
          </div>
          <div className="text-center py-8 text-gray-500">
            No recruiter performance data available
          </div>
        </div>

        {/* Trucking News */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">📰</span>
            <h2 className="text-xl font-semibold text-gray-800">Trucking News</h2>
          </div>
          
          {news.map(article => (
            <div key={article.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
              <h3 className="font-medium text-gray-800 mb-2">{article.title}</h3>
              <span className="text-sm text-gray-500">{article.date}</span>
            </div>
          ))}
          
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            View More News →
          </button>
        </div>
      </div>
    </div>
  );

  const renderSection = (section) => {
    switch (section) {
      case 'dashboard':
        return renderDashboard();
      case 'drivers':
      case 'driver-roster':
        return <DriversSection filter={driverFilter} />;
      case 'jobs':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">Jobs</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Job management system coming soon...</p>
            </div>
          </div>
        );
      case 'carriers':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">Carriers</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Carrier management system coming soon...</p>
            </div>
          </div>
        );
      case 'recruiters':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">Recruiters</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Recruiter management system coming soon...</p>
            </div>
          </div>
        );
      case 'admin':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">Admin</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Admin panel coming soon...</p>
            </div>
          </div>
        );
      case 'operations':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">Operations</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Operations dashboard coming soon...</p>
            </div>
          </div>
        );
      case 'safety':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">Safety</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Safety management system coming soon...</p>
            </div>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="bg-white p-1 rounded">
                  <span className="text-blue-600 text-xl font-bold">📋</span>
                </div>
                <span className="text-white text-xl font-bold">DriveLine Recruit</span>
              </div>
              
              <nav className="hidden md:flex space-x-2">
                {navigationItems.map(item => (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => handleSectionClick(item.id, item.hasDropdown)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeSection === item.id || activeSection.startsWith(item.id) || activeDropdown === item.id
                          ? 'bg-white text-blue-600 border border-blue-200'
                          : 'text-white hover:bg-blue-700'
                      }`}
                    >
                      {item.label}
                      {item.hasDropdown && (
                        <span className="ml-1 text-xs">
                          {activeDropdown === item.id ? '▲' : '▼'}
                        </span>
                      )}
                    </button>
                    
                    {/* Dropdown Menu */}
                    {item.hasDropdown && activeDropdown === item.id && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          {item.dropdownItems.map(dropdownItem => (
                            <button
                              key={dropdownItem.id}
                              onClick={() => handleDropdownItemClick(dropdownItem.id, dropdownItem)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {dropdownItem.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-white hover:text-gray-200">
                <span className="text-lg">🔍</span>
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <div className="text-sm text-white">
                  <div className="font-medium">Rebecca</div>
                  <div className="text-blue-200">Beall</div>
                </div>
              </div>
              <button className="text-white hover:text-gray-200">
                <span className="text-lg">↗️</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 py-4">
            {navigationItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {renderSection(activeSection)}
      </main>
    </div>
  );
};

export default Dashboard;

