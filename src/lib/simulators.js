// --- Production ---
export const generateProductionData = (horizon = 15, lateralLength = 7500) => {
  const data = [];
  const months = horizon * 12;
  for (let i = 0; i < months; i++) {
    const year = Math.floor(i / 12);
    const month = i % 12;
    const oilRate = (2500 * lateralLength / 7500) * Math.pow((1 + 0.8 * i / 12), -1.2);
    const gasRate = (4500 * lateralLength / 7500) * Math.pow((1 + 0.7 * i / 12), -1.1);
    const waterRate = 150 * (1 - Math.exp(-i / 24)) + (50 * i / 12);
    const oilCum = i === 0 ? oilRate : data[i - 1].cumulativeOil + oilRate;
    const gasCum = i === 0 ? gasRate : data[i - 1].cumulativeGas + gasRate;
    const waterCum = i === 0 ? waterRate : data[i - 1].cumulativeWater + waterRate;
    data.push({
      month: i + 1,
      date: `Y${year + 1}M${month + 1}`,
      oil: Math.max(0, oilRate),
      gas: Math.max(0, gasRate),
      water: Math.max(0, waterRate),
      cumulativeOil: oilCum,
      cumulativeGas: gasCum,
      cumulativeWater: waterCum,
      waterCut: waterRate / (oilRate + waterRate) * 100
    });
  }
  return data;
};

// --- Economics ---
export const generateEconomicData = (productionData, params) => {
  const data = [];
  let cumNPV = 0;
  productionData.forEach((prod, i) => {
    const oilRevenue = prod.oil * params.oilPrice * (1 - params.oilDiff) * params.oilNRI;
    const gasRevenue = (prod.gas / 1000) * params.gasPrice * params.gasMult * params.gasNRI;
    const totalRevenue = oilRevenue + gasRevenue;
    const opex = params.fixedOPEX / 12 + prod.oil * params.oilOPEX + (prod.gas / 1000) * params.gasOPEX + prod.water * params.waterOPEX;
    const severanceTax = oilRevenue * params.oilSeverance + gasRevenue * params.gasSeverance;
    const adValoremTax = totalRevenue * params.adValorem;
    const netCashFlow = totalRevenue - opex - severanceTax - adValoremTax;
    const capex = i === 0 ? params.totalCAPEX : 0;
    const freeCashFlow = netCashFlow - capex;
    const discountFactor = Math.pow(1 + params.discountRate, -i / 12);
    const discountedCF = freeCashFlow * discountFactor;
    cumNPV += discountedCF;
    data.push({
      month: i + 1,
      date: prod.date,
      revenue: totalRevenue,
      opex,
      taxes: severanceTax + adValoremTax,
      netCashFlow,
      freeCashFlow,
      cumulativeCashFlow: i === 0 ? freeCashFlow : data[i - 1].cumulativeCashFlow + freeCashFlow,
      discountedCF,
      npv: cumNPV
    });
  });
  return data;
};

// --- Carbon ---
export const generateCarbonData = (productionData, params) => {
  const data = [];
  let cumCO2 = 0;
  productionData.forEach((prod, i) => {
    const combustionOil = prod.oil * 0.43;
    const combustionGas = prod.gas * 0.053;
    const processingEmissions = (prod.oil * 2.1 + prod.gas * 0.8) * params.processingIntensity;
    const flaringEmissions = prod.gas * params.flarePercent * 0.053 * 28;
    const totalEmissions = combustionOil + combustionGas + processingEmissions + flaringEmissions;
    cumCO2 += totalEmissions / 1000;
    const boe = prod.oil + prod.gas / 6;
    const intensity = boe > 0 ? totalEmissions / boe : 0;
    data.push({
      month: i + 1,
      date: prod.date,
      combustionOil: combustionOil / 1000,
      combustionGas: combustionGas / 1000,
      processing: processingEmissions / 1000,
      flaring: flaringEmissions / 1000,
      totalEmissions: totalEmissions / 1000,
      cumulativeCO2: cumCO2,
      intensity,
      boe
    });
  });
  return data;
};
