export const MOCK_USERS = [
  { email: 'investor@alphawell.com', password: 'demo123', role: 'investor', name: 'John Investor' },
  { email: 'operator@alphawell.com', password: 'demo123', role: 'operator', name: 'Sarah Operator' },
  { email: 'analyst@alphawell.com', password: 'demo123', role: 'analyst', name: 'Mike Analyst' }
];

export const NEIGHBOR_WELLS = [
  { id: 'W-2847', lat: 31.8456, lng: -102.3678, eur: 425000, npv: 8.5, formation: 'Wolfcamp A', carbonIntensity: 42, status: 'producing', distance: 0.8 },
  { id: 'W-2901', lat: 31.8489, lng: -102.3712, eur: 380000, npv: 7.2, formation: 'Wolfcamp A', carbonIntensity: 38, status: 'producing', distance: 1.2 },
  { id: 'W-2765', lat: 31.8423, lng: -102.3645, eur: 510000, npv: 11.3, formation: 'Wolfcamp B', carbonIntensity: 45, status: 'producing', distance: 0.5 },
  { id: 'W-3012', lat: 31.8501, lng: -102.3789, eur: 295000, npv: 4.8, formation: 'Spraberry', carbonIntensity: 52, status: 'producing', distance: 2.1 },
  { id: 'W-2834', lat: 31.8445, lng: -102.3698, eur: 445000, npv: 9.8, formation: 'Wolfcamp A', carbonIntensity: 40, status: 'producing', distance: 1.0 },
  { id: 'W-2956', lat: 31.8478, lng: -102.3734, eur: 362000, npv: 6.9, formation: 'Wolfcamp B', carbonIntensity: 47, status: 'producing', distance: 1.5 },
];

export const MOCK_DECISIONS = [
  { id: 'DEC-2024-001', name: 'Midland Basin - Wolfcamp A Prospect', date: '2024-09-15', formation: 'Wolfcamp A', verdict: 'Drill', npv: 9.2, irr: 32.5, eur: 445000, carbonIntensity: 41, totalCO2: 2850 },
  { id: 'DEC-2024-002', name: 'Delaware Basin - Bone Spring', date: '2024-08-22', formation: 'Bone Spring', verdict: 'Evaluate Further', npv: 5.8, irr: 18.2, eur: 325000, carbonIntensity: 55, totalCO2: 3200 },
  { id: 'DEC-2024-003', name: 'Permian Highway - Spraberry', date: '2024-07-10', formation: 'Spraberry', verdict: 'High Risk', npv: 3.2, irr: 12.8, eur: 285000, carbonIntensity: 62, totalCO2: 3850 }
];
