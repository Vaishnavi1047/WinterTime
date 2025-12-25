import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';


const INITIAL_CHART_DATA = [
  { year: '2023', actual: 54000, target: 54000 },
  { year: '2024', actual: 53500, target: 52500 },
  { year: '2025', actual: 0, target: 51000 }, 
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
  
  const [logs, setLogs] = useState([]); 
  const [latestLog, setLatestLog] = useState(null); 
  const [chartData, setChartData] = useState(INITIAL_CHART_DATA);
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  

  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchHistory = useCallback(async () => {
  const token = authService.getToken();
  if (!token) return;

  try {
    const response = await fetch(`${API_URL}/api/emissions/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    console.log("DB DATA RECEIVED:", data);

    if (data && data.length > 0) {
      setLogs(data);
    
      setLatestLog(data[0]); 
      
      setChartData(prev => prev.map(d => 
        d.year == '2025' ? { ...d, actual: data[0].calculatedEmissions } : d
      ));
    }
  } catch (error) {
    console.error("History Fetch Error:", error);
  }
}, [API_URL]);


  const fetchMarketNews = useCallback(async () => {

    if (news.length > 0) return;

    setNewsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/news/market-news`);
      if (!response.ok) throw new Error("News unreachable");
      
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("News Fetch Error:", error);
      setNews([]);
    } finally {
      setNewsLoading(false);
    }
  }, [API_URL, news.length]);


  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, fetchHistory]);

  useEffect(() => {
    if (activeTab === 'news') {
      fetchMarketNews();
    }
  }, [activeTab, fetchMarketNews]);


  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setLogs([]);
    setLatestLog(null);
    setNews([]);
    setChartData(INITIAL_CHART_DATA);
    setActiveTab('dashboard');
  };

  const updateUser = (updatedUser) => {
    const token = authService.getToken();
    authService.setSession(token, updatedUser);
    setUser(updatedUser);
  };


  const addCalculation = (newLog) => {
 
    setLatestLog(newLog);
    

    setLogs(prev => [newLog, ...prev]);
    
 
    setChartData(prev => prev.map(d => 

      d.year == newLog.year ? { ...d, actual: newLog.calculatedEmissions } : d
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
console.log("Current Chart Data for 2025:", chartData.find(d => d.year == '2025'));
console.log("Latest Log Inputs:", latestLog?.inputs);

  return {
    user, 
    activeTab, 
    setActiveTab, 
    logs, 
    recentLog: latestLog, 
    chartData, 
    listings,
    news, 
    newsLoading,
    login, 
    logout, 
    updateUser, 
    addCalculation, 
    addListing, 
    updateListingStatus, 
    buyListing
  };
};