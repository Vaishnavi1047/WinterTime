import React, { useState, useEffect } from 'react';
import { IconTrading, IconCheckCircle, IconLock } from './Icons';
import { sellService } from '../services/sellService';
import { marketService } from '../services/marketService';

const TradingPortal = ({ user, onAddListing, onBuyListing }) => {
  const [activeTab, setActiveTab] = useState('market');
  const [marketListings, setMarketListings] = useState([]);
  const [loadingMarket, setLoadingMarket] = useState(false);

  const [sellForm, setSellForm] = useState({
    amount: '',
    pricePerUnit: '',
    projectType: ''
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // 1. Only run logic if the active tab is 'market'
    if (activeTab === 'market') {

      // 2. Define an async function to "wrap" the state updates.
      // This moves 'setLoadingMarket' into the async microtask queue,
      // which satisfies the ESLint rule and prevents cascading renders.
      const fetchMarketData = async () => {
        setLoadingMarket(true);

        try {
          const data = await marketService.getApprovedListings();
          setMarketListings(data);
        } catch (err) {
          console.error("Failed to fetch listings:", err);
        } finally {
          setLoadingMarket(false);
        }
      };

      fetchMarketData();
    }
  }, [activeTab]);

  const showNotification = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSellSubmit = async (e) => {
    e.preventDefault();

    if (!sellForm.amount || !sellForm.pricePerUnit || !sellForm.projectType) {
      showNotification('Please complete all fields.', 'error');
      return;
    }

    try {
      const listing = await sellService.createListing({
        credits: Number(sellForm.amount),
        pricePerCredit: Number(sellForm.pricePerUnit),
        projectType: sellForm.projectType
      });

      showNotification('Listing submitted for verification.', 'success');
      setSellForm({ amount: '', pricePerUnit: '', projectType: '' });
      onAddListing && onAddListing(listing);
    } catch (err) {
      showNotification(err.message || 'Server error.', 'error');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <IconTrading /> Carbon Credit Trading Portal
        </h2>

        <div className="bg-slate-800 p-1 rounded-lg flex border border-slate-700">
          <button
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 rounded text-sm font-medium ${activeTab === 'market'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-400'
              }`}
          >
            Marketplace
          </button>

          <button
            onClick={() => setActiveTab('sell')}
            className={`px-4 py-2 rounded text-sm font-medium ${activeTab === 'sell'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-400'
              }`}
          >
            Sell Credits
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-3 rounded text-sm font-bold text-center ${notification.type === 'success'
          ? 'bg-emerald-500/10 text-emerald-400'
          : 'bg-red-500/10 text-red-400'
          }`}>
          {notification.msg}
        </div>
      )}

      {/* MARKET TAB */}
      {activeTab === 'market' && (
        <div>
          {loadingMarket ? (
            <div className="text-center text-slate-400 py-10">
              Loading market listings...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketListings.length > 0 ? (
                marketListings.map(listing => {
                  const totalCost = listing.credits * listing.pricePerCredit;

                  return (
                    <div
                      key={listing._id}
                      className="bg-linear-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-emerald-900/20 transition-all"
                    >
                      {/* Top Row */}
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-emerald-900/50 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">
                          VERIFIED
                        </span>
                        <span className="text-slate-500 text-xs">
                          {listing.createdAt
                            ? new Date(listing.createdAt).toLocaleDateString()
                            : ''}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-white font-bold text-lg">
                        {listing.projectType}
                      </h3>

                      <p className="text-slate-400 text-sm mt-1">
                        Seller: {listing.developerId?.companyName || 'Unknown'}
                      </p>

                      {/* Info Box */}
                      <div className="mt-5 bg-slate-950/60 border border-slate-700 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Volume</span>
                          <span className="text-white font-mono font-bold">
                            {listing.credits} tCO2e
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Price</span>
                          <span className="text-emerald-400 font-mono font-bold">
                            ₹{listing.pricePerCredit} / unit
                          </span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center mt-5">
                        <span className="text-slate-400 text-sm">Total Cost</span>
                        <span className="text-white font-bold text-lg">
                          ₹{totalCost.toLocaleString()}
                        </span>
                      </div>

                      {/* Buy Button */}
                      <button
                        onClick={async () => {
                          try {
                            //console.log("Buying listing:", listing._id);
                            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/buycredits/buy/${listing._id}`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ userId: user._id })
                            });

                            const data = await response.json();
                            console.log("Buy response data:", data);
                            if (response.ok) {
                              showNotification(
                                `Purchase successful! New calculated emissions: ${data.updatedEmissions} tCO2e`,
                                "success"
                              );

                              // Optional: update state to remove the purchased listing
                              setMarketListings(prev => prev.filter(l => l._id !== listing._id));
                              onBuyListing && onBuyListing(listing._id);

                            } else {
                              showNotification(data.error || "Purchase failed.", "error");
                            }
                          } catch (err) {
                            showNotification(err.message || "Server error.", "error");
                          }
                        }}
                        className="mt-5 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all active:scale-95"
                      >
                        Buy Now
                      </button>

                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-20 text-slate-500 border border-dashed border-slate-700 rounded-xl">
                  Marketplace is currently empty.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SELL TAB */}
      {activeTab === 'sell' && (
        <div>
          {user.role === 'OFFSET_DEVELOPER' ? (
            <div className="max-w-md mx-auto bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-slate-100 font-bold mb-4">
                Create New Listing
              </h3>

              <form onSubmit={handleSellSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Type"
                  value={sellForm.projectType}
                  onChange={e =>
                    setSellForm({ ...sellForm, projectType: e.target.value })
                  }
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded"
                />

                <input
                  type="number"
                  placeholder="Credits"
                  value={sellForm.amount}
                  onChange={e =>
                    setSellForm({ ...sellForm, amount: e.target.value })
                  }
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded"
                />

                <input
                  type="number"
                  placeholder="Price per Credit"
                  value={sellForm.pricePerUnit}
                  onChange={e =>
                    setSellForm({ ...sellForm, pricePerUnit: e.target.value })
                  }
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded"
                />

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded"
                >
                  Post for Verification
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-800/20 border border-slate-700 rounded">
              <IconLock />
              <h3 className="text-white font-bold mt-4">Feature Locked</h3>
              <p className="text-slate-400 mt-2">
                Only Offset Developers can sell credits.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TradingPortal;