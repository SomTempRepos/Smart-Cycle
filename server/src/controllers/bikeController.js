const fs = require('fs');
const path = require('path');
const { formatISTDate } = require('../utils/dateUtils');
const { broadcastBikeData } = require('../services/websocketService');

exports.receiveData = async (req, res) => {
  try {
    const { bikeId, timestamp, data } = req.body;

    if (
      typeof bikeId !== 'string' || !bikeId.trim() ||
      !timestamp || isNaN(new Date(timestamp).getTime()) ||
      typeof data !== 'object' || data === null
    ) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const formattedDate = formatISTDate(timestamp);
    const bikeDir = path.join(__dirname, '../../data/bikes', bikeId);

    if (!fs.existsSync(bikeDir)) fs.mkdirSync(bikeDir, { recursive: true });

    // Append to daily log
    const dailyLogPath = path.join(bikeDir, `${formattedDate}-raw.json`);
    const logData = fs.existsSync(dailyLogPath)
      ? JSON.parse(fs.readFileSync(dailyLogPath, 'utf-8'))
      : [];

    logData.push({ timestamp, data });
    fs.writeFileSync(dailyLogPath, JSON.stringify(logData, null, 2));

    // Overwrite current session
    const currentSessionPath = path.join(bikeDir, 'current-session.json');
    const currentSessionData = { timestamp, data };
    fs.writeFileSync(currentSessionPath, JSON.stringify(currentSessionData, null, 2));

    // Emit to frontend
    broadcastBikeData({
  bikeId,
  ...currentSessionData
});

    res.status(200).json({ message: 'Data saved & broadcasted' });

  } catch (error) {
    console.error('[ERROR] Failed to save data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCurrentSession = (req, res) => {
  const { bikeId } = req.params;
  const filePath = path.join(__dirname, '../../data/bikes', bikeId, 'current-session.json');

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'No current session data found' });
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(data);
  } catch (err) {
    console.error('[ERROR] Reading current-session:', err);
    res.status(500).json({ message: 'Failed to read session data' });
  }
};

exports.getHistoricData = (req, res) => {
  const { bikeId } = req.params;
  // Compose filename based on today's date in your desired format (YYYY-MM-DD)
  const todayDate = new Date().toISOString().split('T')[0]; // e.g. "2025-07-04"
  const filePath = path.join(__dirname, '../../data/bikes', bikeId, `${todayDate}-raw.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'No historic data found for today' });
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(data);
  } catch (err) {
    console.error('[ERROR] Reading historic data:', err);
    res.status(500).json({ message: 'Failed to read historic data' });
  }
};
