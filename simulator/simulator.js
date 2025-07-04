const axios = require('axios');

const SERVER_URL = 'http://localhost:3001/api/bike/data';
const BIKE_ID = 'bike-001';
const INTERVAL_MS = 5000;

function getCurrentTimestampISO() {
  return new Date().toISOString();
}

// Function to generate random-ish data for testing
function generateData() {
  return {
    distance: parseFloat((Math.random() * 20).toFixed(2)),    // 0 to 20 km
    avgSpeed: parseFloat((Math.random() * 50).toFixed(2)),    // 0 to 50 km/h
    location: {
      lat: 12.9716 + (Math.random() - 0.5) * 0.01,           // Around Bangalore approx
      lng: 77.5946 + (Math.random() - 0.5) * 0.01
    }
  };
}

const sendData = async () => {
  const payload = {
    bikeId: BIKE_ID,
    timestamp: getCurrentTimestampISO(),
    data: generateData(),
  };

  try {
    const response = await axios.post(SERVER_URL, payload);
    console.log(`[✓] Sent data at ${payload.timestamp} - Status: ${response.status}`);
  } catch (error) {
    console.error('[x] Error sending data:', error.message);
  }
};

console.log('🚴 ESP32 Simulator started...');
sendData();
setInterval(sendData, INTERVAL_MS);
