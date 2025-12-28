import React from 'react';
import { useAppState } from './hooks/useAppState';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Calculator from './components/Calculator';
import CarbonAdvisor from './components/CarbonAdvisor';
import AuthPage from './components/AuthPage';
import AccountSettings from './components/AccountSettings';
import TradingPortal from './components/TradingPortal';
import { IconChart, IconCalculator, IconRobot, IconSettings, IconTrading, IconNewspaper, IconCheckCircle } from './components/Icons';
import ApprovalsPanel from './components/ApprovalsPanel';

const navItemsBase = [
  { id: 'dashboard', label: 'Dashboard', icon: IconChart },
  { id: 'trading', label: 'Trading Portal', icon: IconTrading },
  { id: 'calculator', label: 'Calculator Engine', icon: IconCalculator },
  { id: 'advisor', label: 'Carbon Advisor (AI)', icon: IconRobot },
   { id: "news", label: "Market News", icon: IconNewspaper },
  { id: 'settings', label: 'Account Settings', icon: IconSettings },
];

function getNavItems(user) {
  if (!user) return navItemsBase;
  if (["ADMIN", "VERIFIER"].includes(user.role)) {
    return [
      ...navItemsBase.slice(0, 1),
      { id: 'approvals', label: 'Approvals', icon: IconCheckCircle },
      ...navItemsBase.slice(1)
    ];
  }
  return navItemsBase;
}

function App() {
  const state = useAppState();

  if (!state.user) return <AuthPage onLogin={(user, token) => state.login(user, token)} />;

  const navItems = getNavItems(state.user);
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Header user={state.user} />

      <div className="flex flex-1 overflow-hidden relative">
        <aside className="w-64 bg-slate-800/30 border-r border-slate-800 hidden md:flex flex-col z-20">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => state.setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  state.activeTab === item.id
                    ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                <item.icon />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto z-10 p-6">
           {state.activeTab === "news" && (
            <MarketNews news={state.news} loading={state.newsLoading} />
          )}
          {state.activeTab === 'dashboard' && <Dashboard user={state.user} data={state.chartData} recentLog={state.logs} />}
          {state.activeTab === 'approvals' && <ApprovalsPanel />}
          {state.activeTab === 'calculator' && <Calculator onCalculate={state.addCalculation} />}
          {state.activeTab === 'advisor' && <CarbonAdvisor user={state.user} recentLog={state.logs} />}
          {state.activeTab === 'trading' && (
            <TradingPortal 
              user={state.user} listings={state.listings} 
              onAddListing={state.addListing} onUpdateListingStatus={state.updateListingStatus} onBuyListing={state.buyListing} 
              {state.activeTab === "settings" && (
            <AccountSettings
              user={state.user}
              onUpdateUser={state.updateUser}
              onLogout={state.logout}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
