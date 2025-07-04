'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Activity, Bike, Clock, MapPin, Gauge, HeartPulse, BatteryFull, Navigation, ChevronDown, Zap, Wifi, Signal, Calendar } from 'lucide-react';

type BikeDataEntry = {
  bikeId: string;
  timestamp: string;
  data: {
    distance: number;
    avgSpeed: number;
    location: {
      lat: number;
      lng: number;
    };
    battery?: number;
    heartRate?: number;
  };
};

type BikeData = {
  bikeId: string;
  timestamp: string;
  data: {
    distance: number;
    avgSpeed: number;
    location: {
      lat: number;
      lng: number;
    };
    battery?: number;
    heartRate?: number;
  };
};

export default function AdminDashboard() {
  const [currentData, setCurrentData] = useState<BikeData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [bikeId, setBikeId] = useState('bike-001');
  const [availableBikes, setAvailableBikes] = useState([
    'bike-001',
    'bike-002',
    'bike-003',
    'bike-004'
  ]);
  const [connectionStrength, setConnectionStrength] = useState(3);

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      console.log('[✓] Connected to WebSocket server');
      setIsConnected(true);
      // Simulate connection strength changes
      const interval = setInterval(() => {
        setConnectionStrength(Math.floor(Math.random() * 3) + 2);
      }, 5000);
      return () => clearInterval(interval);
    });

    socket.on('bikeData', (data: BikeData) => {
      console.log('[DATA]', data);
      setCurrentData(data);
      setLastUpdate(new Date().toLocaleTimeString());
    });

    socket.on('disconnect', () => {
      console.warn('[!] Disconnected from WebSocket');
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Calculate derived metrics
  const calculateCalories = (distance: number) => {
    // Simple estimation: ~50 calories per km
    return (distance * 50).toFixed(0);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Bike className="h-6 w-6 text-blue-400" />
          <h1 className="text-xl font-bold">BikeTrack Pro</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Signal className="h-5 w-5 text-blue-400" />
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 w-2 rounded-full ${i < connectionStrength ? 'bg-green-400' : 'bg-gray-600'}`}
                />
              ))}
            </div>
          </div>
          <div className={`flex items-center ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            <div className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span>{isConnected ? 'Live Connected' : 'Disconnected'}</span>
          </div>
          {lastUpdate && (
            <div className="flex items-center text-gray-400 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              Last update: {lastUpdate}
            </div>
          )}
        </div>
      </nav>

      <main className="p-6 space-y-6">
        {/* Bike Selection and Status Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <label htmlFor="bike-select" className="text-gray-300">Select Bike:</label>
            <div className="relative">
              <select
                id="bike-select"
                value={bikeId}
                onChange={(e) => setBikeId(e.target.value)}
                className="appearance-none bg-gray-700 border border-gray-600 rounded-md py-2 pl-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableBikes.map((bike) => (
                  <option key={bike} value={bike}>{bike}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center bg-gray-800 px-3 py-2 rounded-md">
              <Wifi className="h-4 w-4 mr-2 text-blue-400" />
              <span className="text-sm">Real-time Tracking</span>
            </div>
            <div className="flex items-center bg-gray-800 px-3 py-2 rounded-md">
              <Zap className="h-4 w-4 mr-2 text-yellow-400" />
              <span className="text-sm">Active Session</span>
            </div>
            <div className="flex items-center bg-gray-800 px-3 py-2 rounded-md">
              <Calendar className="h-4 w-4 mr-2 text-purple-400" />
              <span className="text-sm">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Current Session Card */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-blue-400 mr-2" />
              <h2 className="text-lg font-semibold">Current Session - {currentData?.bikeId || bikeId}</h2>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              {currentData ? new Date(currentData.timestamp).toLocaleTimeString() : '--:--:--'}
            </div>
          </div>
          
          {currentData ? (
            <div className="p-6">
              {/* Main Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-4 rounded-xl shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-blue-200">Distance</h3>
                    <Navigation className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold">{currentData.data?.distance?.toFixed(2) ?? '0.00'}</p>
                    <p className="ml-2 text-blue-300 mb-1">km</p>
                  </div>
                  <p className="text-xs text-blue-200 mt-2">Total distance covered</p>
                </div>

                <div className="bg-gradient-to-br from-green-900 to-green-800 p-4 rounded-xl shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-green-200">Avg Speed</h3>
                    <Gauge className="h-5 w-5 text-green-300" />
                  </div>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold">{currentData.data?.avgSpeed?.toFixed(2) ?? '0.00'}</p>
                    <p className="ml-2 text-green-300 mb-1">km/h</p>
                  </div>
                  <p className="text-xs text-green-200 mt-2">Current pace</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-4 rounded-xl shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-purple-200">Calories</h3>
                    <HeartPulse className="h-5 w-5 text-purple-300" />
                  </div>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold">{calculateCalories(currentData.data?.distance || 0)}</p>
                    <p className="ml-2 text-purple-300 mb-1">kcal</p>
                  </div>
                  <p className="text-xs text-purple-200 mt-2">Estimated burn</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 p-4 rounded-xl shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-yellow-200">Battery</h3>
                    <BatteryFull className="h-5 w-5 text-yellow-300" />
                  </div>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold">{currentData.data?.battery ?? '--'}</p>
                    <p className="ml-2 text-yellow-300 mb-1">%</p>
                  </div>
                  <p className="text-xs text-yellow-200 mt-2">Device battery level</p>
                </div>
              </div>

              {/* Location and Additional Data */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-700 p-5 rounded-xl border border-gray-600">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-5 w-5 text-blue-400 mr-2" />
                    <h3 className="font-medium">Current Location</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                      <span className="text-gray-400">Latitude:</span>
                      <span className="font-mono font-medium">
                        {currentData.data?.location?.lat?.toFixed(6) ?? '--.------'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                      <span className="text-gray-400">Longitude:</span>
                      <span className="font-mono font-medium">
                        {currentData.data?.location?.lng?.toFixed(6) ?? '--.------'}
                      </span>
                    </div>
                    <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200">
                      View on Map
                    </button>
                  </div>
                </div>

                <div className="bg-gray-700 p-5 rounded-xl border border-gray-600">
                  <div className="flex items-center mb-4">
                    <Clock className="h-5 w-5 text-blue-400 mr-2" />
                    <h3 className="font-medium">Session Details</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                      <span className="text-gray-400">Start Time:</span>
                      <span className="font-medium">
                        {new Date(currentData.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                      <span className="text-gray-400">Duration:</span>
                      <span className="font-medium">
                        {Math.floor(Math.random() * 60) + 1} min
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                      <span className="text-gray-400">Heart Rate:</span>
                      <span className="font-medium flex items-center">
                        {currentData.data?.heartRate ?? '--'}
                        {currentData.data?.heartRate && (
                          <span className="ml-1 text-xs text-gray-400">bpm</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-400">
              <p>Waiting for current data...</p>
              <div className="mt-4 h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center">
            <div className="bg-blue-900/50 p-2 rounded-lg mr-3">
              <Bike className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Active Bikes</p>
              <p className="font-semibold">4</p>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center">
            <div className="bg-green-900/50 p-2 rounded-lg mr-3">
              <Activity className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Today's Sessions</p>
              <p className="font-semibold">12</p>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center">
            <div className="bg-purple-900/50 p-2 rounded-lg mr-3">
              <MapPin className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Avg Distance</p>
              <p className="font-semibold">8.2 km</p>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center">
            <div className="bg-yellow-900/50 p-2 rounded-lg mr-3">
              <Gauge className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Avg Speed</p>
              <p className="font-semibold">18.5 km/h</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}