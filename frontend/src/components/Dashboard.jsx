import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { getComplianceStatus } from '../services/calculationService';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded shadow-xl text-xs">
        <p className="font-bold text-slate-200 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="mb-1">
            {entry.name}: {entry.value} tCO2e
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = ({ data, recentLog }) => {
 
  const currentYearData = data?.find(d => d.year == '2025');
  const actual = currentYearData?.actual || 0;
  const target = currentYearData?.target || 0;
  const status = getComplianceStatus(actual, target);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Current Emissions (2025)</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100">{actual}</span>
            <span className="text-sm text-slate-500">tCO2e</span>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">BEE Mandated Target</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100">{target}</span>
            <span className="text-sm text-slate-500">tCO2e</span>
          </div>
        </div>

        <div className={`bg-slate-800 border rounded-lg p-5 ${status.status === 'COMPLIANT' ? 'border-emerald-500/50' : 'border-red-500/50'}`}>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Compliance Status</p>
          <div className="mt-2">
            <span className={`text-xl font-bold ${status.status === 'COMPLIANT' ? 'text-emerald-400' : 'text-red-400'}`}>
              {status.status}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">{status.message}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-5 h-100 flex flex-col">
          <h3 className="text-slate-200 font-semibold mb-6">Emissions Trajectory</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{fontSize: 12}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} fill="url(#colorActual)" name="Actual Emissions" />
                <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="BEE Target Cap" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      
        {/* Breakdown Panel */}
<div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
  <h3 className="text-slate-200 font-semibold mb-4">Latest Fuel Mix</h3>
  {recentLog && recentLog.inputs ? (
    <div className="space-y-4">
      {['electricityGrid', 'coalThermal', 'diesel'].map((fuel) => {
        const fuelValue = recentLog.inputs?.[fuel] || 0;
        
        
        const fuelConfig = {
          electricityGrid: { label: 'Grid Electricity', unit: 'kWh', color: '#10b981' }, 
          coalThermal: { label: 'Thermal Coal', unit: 'kg', color: '#f59e0b' },     
          diesel: { label: 'Diesel', unit: 'L', color: '#ef4444' }                  
        };

        const config = fuelConfig[fuel];

       
        const factors = { electricityGrid: 0.71, coalThermal: 2.42, diesel: 2.68 };
        const categoryEmissions = (fuelValue * factors[fuel]) / 1000;
        const totalEmissions = recentLog.calculatedEmissions || 1;
        const percentage = Math.min((categoryEmissions / totalEmissions) * 100, 100);

        return (
          <div key={fuel} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{config.label}</span>
              <span className="text-slate-200 font-mono">
                {fuelValue.toLocaleString()} <span className="text-slate-500 font-sans ml-1">{config.unit}</span>
              </span>
            </div>
           
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 rounded-full transition-all duration-1000" 
                style={{ 
                  width: `${percentage}%`, 
                  backgroundColor: config.color
                }}
              ></div>
            </div>
          </div>
        );
      })}

      

      <div className="mt-8 p-3 bg-slate-900 rounded border border-slate-700">
        <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-bold">TOTAL CONVERTED</p>
        <p className="text-xl font-bold text-slate-200">
          {recentLog.calculatedEmissions} <span className="text-sm font-normal text-emerald-500 ml-1">tCO2e</span>
        </p>
      </div>
    </div>
  ) : (
  
    <div className="h-full min-h-50 flex flex-col items-center justify-center text-slate-500 text-center p-4">
       <p className="text-sm italic">No data available.</p>
    </div>
  )}
</div>
      </div>
    </div>
  );
};

export default Dashboard;