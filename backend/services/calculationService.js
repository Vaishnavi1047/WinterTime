const EMISSION_FACTORS = {
  GRID_ELECTRICITY: 0.71,
  COAL: 2.42,
  DIESEL: 2.68
};

exports.calculateEmissions = (inputs) => {
  const electricity = (inputs.electricityGrid || 0) * EMISSION_FACTORS.GRID_ELECTRICITY;
  const coal = (inputs.coalThermal || 0) * EMISSION_FACTORS.COAL;
  const diesel = (inputs.diesel || 0) * EMISSION_FACTORS.DIESEL;

  const totalKg = electricity + coal + diesel;
  return parseFloat((totalKg / 1000).toFixed(3)); 
};