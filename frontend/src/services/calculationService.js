
const EMISSION_FACTORS = {
  GRID_ELECTRICITY: 0.71,
  COAL: 2.42,
  DIESEL: 2.68
};

export const calculateTotalEmissions = (inputs) => {
  const electricityEmissions = (inputs.electricityGrid || 0) * EMISSION_FACTORS.GRID_ELECTRICITY;
  const coalEmissions = (inputs.coalThermal || 0) * EMISSION_FACTORS.COAL;
  const dieselEmissions = (inputs.diesel || 0) * EMISSION_FACTORS.DIESEL;

  const totalKg = electricityEmissions + coalEmissions + dieselEmissions;
  const totalTons = totalKg / 1000; 

  return {
    totalTons: parseFloat(totalTons.toFixed(3)),
    breakdown: {
      electricity: parseFloat((electricityEmissions / 1000).toFixed(3)),
      coal: parseFloat((coalEmissions / 1000).toFixed(3)),
      diesel: parseFloat((dieselEmissions / 1000).toFixed(3))
    }
  };
};

export const getComplianceStatus = (actual, target) => {
  const diff = target - actual;
  if (diff >= 0) {
    return { 
      status: 'COMPLIANT', 
      creditBalance: diff, 
      message: `You are under the limit by ${diff.toFixed(2)} tCO2e. These can be traded as E-Certs.` 
    };
  } else {
    return { 
      status: 'NON_COMPLIANT', 
      deficit: Math.abs(diff), 
      message: `You are exceeding targets by ${Math.abs(diff).toFixed(2)} tCO2e. You must purchase ESCerts.` 
    };
  }
};