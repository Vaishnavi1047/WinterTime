import React, { useState } from 'react';
import { IconTrading, IconCheckCircle, IconClock, IconLock } from './Icons';

const TradingPortal = ({ 
  user, 
  listings, 
  onAddListing, 
  onUpdateListingStatus,
  onBuyListing
}) => {
  const [activeTab, setActiveTab] = useState('market');
  
  // Form State for selling
  const [sellForm, setSellForm] = useState({
    amount: '',
    pricePerUnit: '',
    projectType: ''
  });

  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSellSubmit = (e) => {
    e.preventDefault();
    
    if (!sellForm.amount || !sellForm.pricePerUnit || !sellForm.projectType) {
      showNotification('Please complete all fields correctly before submitting.', 'error');
      return;
    }

    const newListing = {
      id: Date.now().toString(),
      sellerId: user._id,
      sellerName: user.companyName,
      projectType: sellForm.projectType,
      amount: Number(sellForm.amount),
      pricePerUnit: Number(sellForm.pricePerUnit),
      status: 'PENDING', 
      timestamp: new Date().toISOString()
    };

    onAddListing(newListing);
    setSellForm({ amount: '', pricePerUnit: '', projectType: '' });
    showNotification('Listing successfully submitted for verification.', 'success');
  };

  // Logic filters
  const marketListings = listings.filter(l => l.status === 'VERIFIED');
  const myListings = listings.filter(l => l.sellerId === user._id);
  const pendingListings = listings.filter(l => l.status === 'PENDING');

  return (
    <div className="p-6 max-w-6xl mx-auto animate-in fade-in duration-500 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <IconTrading /> Carbon Credit Trading Portal
          </h2>
          <p className="text-slate-400 text-sm mt-1">Buy Verified Carbon Units or sell generated offsets.</p>
        </div>
        
        <div className="bg-slate-800 p-1 rounded-lg flex border border-slate-700">
          <button
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
              activeTab === 'market' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
              activeTab === 'sell' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sell Credits
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`mb-4 p-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 border animate-bounce ${
          notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
          'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {notification.type === 'success' ? <IconCheckCircle /> : <IconLock />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* MARKET VIEW */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketListings.length > 0 ? (
              marketListings.map(listing => (
                <div key={listing.id} className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col justify-between hover:shadow-emerald-900/10 hover:shadow-2xl transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-emerald-900/50 text-emerald-400 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest">VERIFIED</span>
                      <span className="text-slate-500 text-xs">{new Date(listing.timestamp).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-slate-100 font-bold text-lg leading-tight">{listing.projectType}</h3>
                    <p className="text-slate-400 text-sm mt-1">Seller: {listing.sellerName}</p>
                    
                    <div className="my-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Volume</span>
                        <span className="text-slate-200 font-mono font-bold">{listing.amount} tCO2e</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Price</span>
                        <span className="text-emerald-400 font-mono font-bold">₹{listing.pricePerUnit}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 pt-3 border-t border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-400 text-xs">Total</span>
                      <span className="text-white font-bold text-lg">₹{(listing.amount * listing.pricePerUnit).toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => {
                        onBuyListing(listing.id);
                        showNotification('Purchase successful! Credits added to account.', 'success');
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg transition-all active:scale-95"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-500 bg-slate-800/20 rounded-xl border-2 border-dashed border-slate-700">
                The marketplace is currently empty.
              </div>
            )}
          </div>
          
          {/* Admin Demo Simulation Area */}
          {pendingListings.length > 0 && (
            <div className="mt-12 p-6 bg-slate-900/50 rounded-xl border border-slate-800">
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                Admin Approval Queue (Demo)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                  <tbody className="divide-y divide-slate-800">
                    {pendingListings.map(l => (
                      <tr key={l.id}>
                        <td className="py-4 text-slate-200 font-medium">{l.sellerName}</td>
                        <td className="py-4 text-slate-400">{l.projectType} ({l.amount} tCO2e)</td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => {
                              onUpdateListingStatus(l.id, 'VERIFIED');
                              showNotification('Listing approved and published.', 'success');
                            }}
                            className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full hover:bg-emerald-500/20"
                          >
                            Verify & Publish
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SELL VIEW */}
      {activeTab === 'sell' && (
        <div className="h-full">
          {user.role === 'OFFSET_DEVELOPER' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">
                  <h3 className="text-slate-100 font-bold mb-6 flex items-center gap-2">Create New Listing</h3>
                  <form onSubmit={handleSellSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Project Name</label>
                      <input
                        type="text"
                        required
                        value={sellForm.projectType}
                        onChange={e => setSellForm({...sellForm, projectType: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-emerald-500 outline-none"
                        placeholder="Solar/Wind/Hydro..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Units (tCO2e)</label>
                        <input
                          type="number"
                          required
                          value={sellForm.amount}
                          onChange={e => setSellForm({...sellForm, amount: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Price (INR)</label>
                        <input
                          type="number"
                          required
                          value={sellForm.pricePerUnit}
                          onChange={e => setSellForm({...sellForm, pricePerUnit: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg mt-4 transition-all">
                      Post for Verification
                    </button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-slate-100 font-bold">Your Active Inventory</h3>
                {myListings.length > 0 ? (
                  myListings.map(listing => (
                    <div key={listing.id} className="bg-slate-800/40 border border-slate-700 rounded-xl p-5 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-200">{listing.projectType}</div>
                        <div className="text-sm text-slate-500">{listing.amount} Units @ ₹{listing.pricePerUnit}</div>
                      </div>
                      <div>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                          listing.status === 'PENDING' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' : 
                          listing.status === 'VERIFIED' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 
                          'text-slate-500 border-slate-700 bg-slate-700/20'
                        }`}>
                          {listing.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-slate-800/10 border border-dashed border-slate-700 rounded-xl text-slate-500">
                    No listings posted yet.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-100 flex flex-col items-center justify-center text-center p-8 bg-slate-800/20 border border-slate-700 rounded-2xl">
              <div className="bg-slate-700/50 p-5 rounded-full mb-6 text-slate-400"><IconLock /></div>
              <h3 className="text-xl font-bold text-white">Feature Locked</h3>
              <p className="text-slate-400 mt-2 max-w-sm">
                Only <span className="text-emerald-400 font-bold">Offset Project Developers</span> can sell credits. Update your role in Account Settings to enable selling.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TradingPortal;