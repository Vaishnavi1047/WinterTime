import { useState, useEffect } from 'react';
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
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [logs, setLogs] = useState(null);
  const [chartData, setChartData] = useState(INITIAL_CHART_DATA);
  const [listings, setListings] = useState(INITIAL_LISTINGS);

  // --- Auth Handlers ---
  const login = (userData) => {
    // Note: userData from backend should already contain the token
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setActiveTab('dashboard');
  };

  const updateUser = (updatedUser) => {
    // When updating user, we keep the existing token
    const token = authService.getToken();
    authService.setSession(token, updatedUser);
    setUser(updatedUser);
  };

  // --- Business Logic Handlers ---
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

  // --- Market News Fetching ---
  const fetchMarketNews = async () => {
    setNewsLoading(true);
    try {
      // Logic: Use .env variable, or fallback to localhost:5000 if undefined
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/news/market-news`);
      
      if (!response.ok) throw new Error("Backend unreachable");

      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("News Fetch Error:", error);
      setNews([]); // Clear news on error to avoid showing old/broken data
    } finally {
      setNewsLoading(false);
    }
  };

  // Trigger news fetch only when the News tab is opened
  useEffect(() => {
    if (activeTab === 'news') {
      fetchMarketNews();
    }
  }, [activeTab]);

  return {
    user, 
    activeTab, 
    setActiveTab, 
    logs, 
    chartData, 
    listings,
    login, 
    logout, 
    updateUser, 
    addCalculation, 
    addListing, 
    updateListingStatus, 
    buyListing, 
    news, 
    newsLoading
  };
};