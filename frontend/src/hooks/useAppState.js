import { useState } from 'react';
import { authService } from '../services/authService';

const INITIAL_CHART_DATA = [
  { year: '2023', actual: 54000, target: 54000 },
  { year: '2024', actual: 53500, target: 52500 },
  { year: '2025', actual: 51200, target: 51000 },
  { year: '2026', actual: 0, target: 49500 },
  { year: '2027', actual: 0, target: 48000 },
];

const INITIAL_LISTINGS = [
  {
    id: 'l1',
    sellerName: 'Green Energy Corp',
    projectType: 'Solar Farm Rajasthan Phase II',
    amount: 500,
    pricePerUnit: 450,
    status: 'VERIFIED',
    timestamp: new Date().toISOString()
  }
];

export const useAppState = () => {
  const [user, setUser] = useState(authService.getUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState(null);
  const [chartData, setChartData] = useState(INITIAL_CHART_DATA);
  const [listings, setListings] = useState(INITIAL_LISTINGS);

  // Auth Handlers
  const login = (userData) => {
    authService.setSession("mock_jwt_token", userData);
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setActiveTab('dashboard');
  };

  const updateUser = (updatedUser) => {
    authService.setSession(authService.getToken(), updatedUser);
    setUser(updatedUser);
  };

  // Business Logic Handlers
  const addCalculation = (newLog) => {
    setLogs(newLog);
    setChartData(prev => prev.map(d => 
      d.year === '2025' ? { ...d, actual: newLog.calculatedEmissions } : d
    ));
    setActiveTab('dashboard');
  };

  const addListing = (newL) => setListings([newL, ...listings]);

  const updateListingStatus = (id, status) => {
    setListings(prev => prev.map(l => l.id === id ? {...l, status} : l));
  };

  const buyListing = (id) => {
    setListings(prev => prev.map(l => l.id === id ? {...l, status: 'SOLD'} : l));
  };

  return {
    user, activeTab, setActiveTab, logs, chartData, listings,
    login, logout, updateUser, addCalculation, addListing, updateListingStatus, buyListing
  };
};