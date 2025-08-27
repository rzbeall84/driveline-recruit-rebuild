import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DriversSection = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [selectedDrivers, setSelectedDrivers] = useState([]);

  const driverStatuses = [
    'All Statuses',
    'Already Applied with Carrier',
    'App Code Needed',
    'App Edits Needed',
    'Approved to Submit',
    'Carrier Closed File',
    'Carrier Declined',
    'DLS Safety Closed File',
    'DO NOT CALL',
    'Driver Declined',
    'Driver Not Qualified',
    'Duplicate',
    'Hired',
    'In Process',
    'Need to Call Back',
    'New Lead',
    'No Answer',
    'Not Interested',
    'Pending Background',
    'Pending Drug Screen',
    'Pending MVR',
    'Pending Physical',
    'Qualified',
    'Rejected',
    'Submitted to Carrier',
    'Waiting on Driver'
  ];

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading drivers:', error);
      } else {
        setDrivers(data || []);
      }
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = searchTerm === '' || 
      `${driver.first_name} ${driver.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (driver.email && driver.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (driver.phone && driver.phone.includes(searchTerm)) ||
      (driver.status && driver.status.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All Statuses' || driver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedDrivers(filteredDrivers.map(driver => driver.id));
    } else {
      setSelectedDrivers([]);
    }
  };

  const handleSelectDriver = (driverId, checked) => {
    if (checked) {
      setSelectedDrivers([...selectedDrivers, driverId]);
    } else {
      setSelectedDrivers(selectedDrivers.filter(id => id !== driverId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'App Code Needed':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved to Submit':
        return 'bg-green-100 text-green-800';
      case 'Hired':
        return 'bg-blue-100 text-blue-800';
      case 'DO NOT CALL':
        return 'bg-red-100 text-red-800';
      case 'New Lead':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <span className="text-white text-xl">👥</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
            <p className="text-gray-600">Manage all driver profiles and applications</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <span className="mr-2">📥</span>
            Import Drivers
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <span className="mr-2">+</span>
            Add Driver
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search drivers by name, email, phone, CDL, status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="w-full md:w-48">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {driverStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input 
                    type="checkbox" 
                    className="rounded"
                    checked={selectedDrivers.length === filteredDrivers.length && filteredDrivers.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-blue-700">
                  Modified ↑↓
                </th>
                <th className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-blue-700">
                  Recruiter ↑↓
                </th>
                <th className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-blue-700">
                  Driver Name ↑↓
                </th>
                <th className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-blue-700">
                  Phone ↑↓
                </th>
                <th className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-blue-700">
                  Status ↑↓
                </th>
                <th className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-blue-700">
                  Safety Notes ↑↓
                </th>
                <th className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-blue-700">
                  Recruiter Notes ↑↓
                </th>
                <th className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-blue-700">
                  Driver Type ↑↓
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                      Loading drivers...
                    </div>
                  </td>
                </tr>
              ) : filteredDrivers.length > 0 ? (
                filteredDrivers.map((driver, index) => (
                  <tr key={driver.id} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                    <td className="px-4 py-3">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedDrivers.includes(driver.id)}
                        onChange={(e) => handleSelectDriver(driver.id, e.target.checked)}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(driver.updated_at || driver.created_at)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-blue-600 font-medium">
                        {driver.recruiter_name || 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                        {driver.first_name} {driver.last_name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {driver.phone || 'No phone'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                        {driver.status || 'New Lead'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {driver.safety_notes || 'No notes'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {driver.recruiter_notes || 'No notes'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {driver.driver_type || 'Company Driver'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'All Statuses' 
                      ? 'No drivers match your search criteria' 
                      : 'No drivers found. Click "Add Driver" to get started.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {filteredDrivers.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-600 flex justify-between items-center">
            <span>Showing {filteredDrivers.length} of {drivers.length} drivers</span>
            {selectedDrivers.length > 0 && (
              <span className="text-blue-600 font-medium">
                {selectedDrivers.length} selected
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriversSection;

