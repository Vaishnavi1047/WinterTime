const GRID_FACTOR = 0.71; // kgCO2e/kWh (India)

exports.calculateEmissions = ({ electricityKwh, fuelLitres }) => {
  const electricityEmissions = electricityKwh * GRID_FACTOR / 1000;
  const fuelEmissions = fuelLitres * 2.68 / 1000; // Diesel approx
  return electricityEmissions + fuelEmissions;
};
