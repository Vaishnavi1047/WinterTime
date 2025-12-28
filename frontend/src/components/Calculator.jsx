import React, { useState } from 'react';
import { authService } from '../services/authService';

const Calculator = ({ onCalculate }) => {
  const [inputs, setInputs] = useState({
    electricityGrid: 0,
    coalThermal: 0,
    diesel: 0
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCalculating(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/emissions/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({ inputs, year: 2025 }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const savedLog = await response.json();
      
      setResult({
        totalTons: savedLog.calculatedEmissions,
        breakdown: {
            electricity: (inputs.electricityGrid * 0.71) / 1000,
            coal: (inputs.coalThermal * 2.42) / 1000,
            diesel: (inputs.diesel * 2.68) / 1000
        }
      });

      onCalculate(savedLog);
    } catch (err) {
      console.error("Calculation failed", err);
      alert("Failed to save calculation to server.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-xl font-bold text-slate-100">GHG Calculator Engine</h2>
          <p className="text-slate-400 text-sm mt-1">
            Convert energy consumption into verified CO2 equivalent (tCO2e).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6 border-r border-slate-700 bg-slate-800">
            <div className="space-y-4">
              {Object.keys(inputs).map((key) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {key.replace(/([A-Z])/g, ' $1')} 
                    <span className="ml-1 text-slate-600 text-[10px]">
                        ({key === 'electricityGrid' ? 'kWh' : key === 'coalThermal' ? 'kg' : 'Liters'})
                    </span>
                  </label>
                  <input
                    type="number"
                    name={key}
                    value={inputs[key]}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isCalculating}
              className={`w-full py-4 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
                isCalculating 
                ? 'bg-slate-700 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 active:scale-[0.98]'
              }`}
            >
              {isCalculating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                'Sync & Calculate'
              )}
            </button>
          </form>

          {/* Results Display */}
          <div className="p-8 bg-slate-900/30 flex flex-col justify-center">
            {result ? (
              <div className="space-y-8 animate-in zoom-in-95 duration-300">
                <div className="text-center">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">Total Footprint</p>
                  <div className="inline-flex items-baseline gap-2">
                    <span className="text-6xl font-black text-white tracking-tighter">
                      {result.totalTons.toFixed(2)}
                    </span>
                    <span className="text-emerald-500 font-bold text-lg">tCO2e</span>
                  </div>
                </div>

                {/* Breakdown UI */}
                <div className="space-y-3 bg-slate-950/50 rounded-xl p-5 border border-slate-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 italic">Grid Elec.</span>
                    <span className="text-slate-200 font-mono">{result.breakdown.electricity.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 italic">Thermal Coal</span>
                    <span className="text-slate-200 font-mono">{result.breakdown.coal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 italic">Diesel Fuel</span>
                    <span className="text-slate-200 font-mono">{result.breakdown.diesel.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-800 text-[10px] text-center text-slate-500">
                    Emission factors applied per BEE/CCTS India standards.
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2 border border-slate-700">
                    <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <p className="text-slate-500 text-sm font-medium">Ready for Input</p>
                <p className="text-slate-600 text-xs px-10">
                    Fill out the energy metrics on the left to generate your 2025 compliance report.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;