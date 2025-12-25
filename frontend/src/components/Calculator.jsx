import React, { useState } from 'react';
import { calculateTotalEmissions } from '../services/calculationService';

const Calculator = ({ onCalculate }) => {
  const [inputs, setInputs] = useState({
    electricityGrid: 0,
    coalThermal: 0,
    diesel: 0
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const calculation = calculateTotalEmissions(inputs);
    setResult(calculation);

    onCalculate({
      _id: Date.now().toString(),
      period: 'Current-Simulation',
      inputs: { ...inputs },
      calculatedEmissions: calculation.totalTons,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="p-6 space-y-5 border-r border-slate-700">
          <h2 className="text-xl font-bold text-slate-100 mb-4">GHG Calculator</h2>
          {Object.keys(inputs).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-300 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="number"
                name={key}
                value={inputs[key]}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-600 rounded px-3 py-2 text-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>
          ))}
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded">
            Calculate Emissions
          </button>
        </form>

        <div className="p-6 bg-slate-800/50 flex flex-col justify-center">
          {result ? (
            <div className="text-center space-y-4">
              <p className="text-slate-400 text-sm uppercase">Total Footprint</p>
              <div className="text-5xl font-bold text-white">{result.totalTons}</div>
              <div className="text-emerald-400 font-medium">tCO2e</div>
            </div>
          ) : (
            <p className="text-center text-slate-500 italic">Enter energy data to calculate impact.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;