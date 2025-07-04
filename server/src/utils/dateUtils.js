// src/utils/dateUtils.js
function formatISTDate(isoDateStr) {
  const date = new Date(isoDateStr);
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istDate = new Date(date.getTime() + istOffset);
  return istDate.toISOString().split('T')[0]; // YYYY-MM-DD
}

module.exports = { formatISTDate };
