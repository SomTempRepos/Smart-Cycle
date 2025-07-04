'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { 
  Activity, 
  Bike, 
  Clock, 
  MapPin, 
  Gauge, 
  HeartPulse, 
  BatteryFull, 
  Navigation, 
  Zap,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Navbar from '../../components/ui/Navbar';
import StatsCard, { DistanceCard, SpeedCard, BatteryCard, TimeCard } from '../../components/ui/StatsCard';
import Profile from '../../components/tabs/profile';

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

function SpeedChart({ speedHistory }: { speedHistory: Array<{time: string, speed: number}> }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Gauge className="h-5 w-5 mr-2 text-blue-400" />
          Speed Over Time
        </h2>
        <div className="text-sm text-gray-400">
          Last 20 readings
        </div>
      </div>
      <div className="flex-grow min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={speedHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="speed" 
              stroke="#3B82F6" 
              strokeWidth={2}
              fill="url(#speedGradient)"
            />
            <defs>
              <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AchievementsLeaderboard() {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-full flex flex-col">
      <h2 className="text-xl font-semibold mb- flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-purple-400" />
        Your Cycling Achievements
      </h2>
      
      <div className="flex-grow overflow-y-auto">
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-blue-300">Current Ranking</h3>
          <div className="bg-gray-700 p-4 rounded-lg flex items-center">
            <div className="bg-yellow-500 text-gray-900 font-bold rounded-full h-10 w-10 flex items-center justify-center mr-4">
              1st
            </div>
            <div>
              <p className="font-semibold">Gold Cyclist</p>
              <p className="text-sm text-gray-400">Top 1% of all riders</p>
            </div>
          </div>
        </div>

        <div className="mb-1">
          <h3 className="text-lg font-medium mb-2 text-blue-300">Badges Earned</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-3 rounded-lg flex flex-col items-center">
              <div className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center mb-2">
                <Zap className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">Speed Demon</p>
              <p className="text-xs text-gray-400 text-center">25+ km/h avg</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg flex flex-col items-center">
              <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center mb-2">
                <Clock className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">Marathoner</p>
              <p className="text-xs text-gray-400 text-center">1h+ session</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg flex flex-col items-center">
              <div className="bg-purple-500 text-white rounded-full h-8 w-8 flex items-center justify-center mb-2">
                <MapPin className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">Explorer</p>
              <p className="text-xs text-gray-400 text-center">10+ km ride</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg flex flex-col items-center">
              <div className="bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center mb-2">
                <HeartPulse className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">Heart Warrior</p>
              <p className="text-xs text-gray-400 text-center">150+ bpm avg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CycleDashboardHome() {
  const [currentData, setCurrentData] = useState<BikeData | null>(null);
  const [bikeId, setBikeId] = useState('bike-001');
  const [availableBikes, setAvailableBikes] = useState([
    'Cycle  01',
    'Cycle  02',
    'Cycle  03',
    'Cycle  04'
  ]);
  const [speedHistory, setSpeedHistory] = useState<Array<{time: string, speed: number}>>([]);
  const [sessionTime, setSessionTime] = useState(0);
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      console.log('[✓] Connected to WebSocket server');
    });

    socket.on('bikeData', (data: BikeData) => {
      console.log('[DATA]', data);
      setCurrentData(data);
      
      // Update speed history for chart
      const newEntry = {
        time: new Date(data.timestamp).toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        speed: data.data?.avgSpeed || 0
      };
      
      setSpeedHistory(prev => {
        const updated = [...prev, newEntry];
        // Keep only last 20 entries
        return updated.slice(-20);
      });
    });

    socket.on('disconnect', () => {
      console.warn('[!] Disconnected from WebSocket');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Session timer
  useEffect(() => {
    if (currentData) {
      const interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateCalories = (distance: number) => {
    return (distance * 50).toFixed(0);
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'text-green-400';
    if (battery > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSpeedColor = (speed: number) => {
    if (speed > 25) return 'text-green-400';
    if (speed > 15) return 'text-yellow-400';
    return 'text-blue-400';
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar
        bikeId={bikeId}
        setBikeId={setBikeId}
        availableBikes={availableBikes}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <main className="p-6 space-y-6">
        {activeTab === 'Home' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DistanceCard
                value={currentData?.data?.distance?.toFixed(1) || '0.0'}
                trendIcon={TrendingUp}
                onClick={() => console.log('Distance card clicked')}
              />
              <SpeedCard
                value={currentData?.data?.avgSpeed?.toFixed(1) || '0.0'}
                trendIcon={BarChart3}
                valueColor={getSpeedColor(currentData?.data?.avgSpeed || 0)}
                onClick={() => console.log('Speed card clicked')}
              />
              <TimeCard
                value={formatTime(sessionTime)}
                trendIcon={Activity}
                onClick={() => console.log('Time card clicked')}
              />
              <BatteryCard
                value={currentData?.data?.battery || '--'}
                trendIcon={Zap}
                valueColor={getBatteryColor(currentData?.data?.battery || 0)}
                onClick={() => console.log('Battery card clicked')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatsCard
                title="Heart Rate"
                value={currentData?.data?.heartRate || '--'}
                unit="bpm"
                icon={HeartPulse}
                gradient="red"
                size="small"
                onClick={() => console.log('Heart rate card clicked')}
              />
              <StatsCard
                title="Calories Burned"
                value={calculateCalories(currentData?.data?.distance || 0)}
                unit="kcal"
                icon={Activity}
                gradient="orange"
                size="small"
                onClick={() => console.log('Calories card clicked')}
              />
              <StatsCard
                title="Current Bike"
                value={bikeId}
                icon={Bike}
                gradient="purple"
                size="small"
                onClick={() => console.log('Bike card clicked')}
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-[500px]">
              <div className="w-full lg:w-[60%] h-full">
                <SpeedChart speedHistory={speedHistory} />
              </div>
              <div className="w-full lg:w-[40%] h-full">
                <AchievementsLeaderboard />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-400" />
                  Current Location
                </h3>

                <div className="flex flex-col md:flex-row gap-4">
                  {/* Left Side - Coordinates */}
                  <div className="w-full md:w-1/2 space-y-2">
                    <div className="bg-gray-700 p-6 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Latitude</span>
                        <span className="font-mono text-xs text-blue-400">
                          {currentData?.data?.location?.lat?.toFixed(6) || '---.------'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-700 p-6 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Longitude</span>
                        <span className="font-mono text-xs text-blue-400">
                          {currentData?.data?.location?.lng?.toFixed(6) || '---.------'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Map Preview */}
                  <div className="w-full md:w-2/4">
                    {currentData?.data?.location ? (
                      <a 
                        href={`https://www.google.com/maps?q=${currentData.data.location.lat},${currentData.data.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative h-full min-h-[120px] bg-gray-700 rounded-lg overflow-hidden group"
                      >
                        {/* Static Map Placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-gray-800 flex items-center justify-center">
                          <div className="text-center p-4">
                            <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2 animate-pulse" />
                            <span className="text-xs text-white opacity-80">Click to view in Google Maps</span>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="h-full min-h-[120px] bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-400">No location data available</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <HeartPulse className="h-5 w-5 mr-2 text-red-400" />
                  Health & Performance Summary
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Average Speed</span>
                      <span className="font-semibold text-green-400">
                        {currentData?.data?.avgSpeed?.toFixed(1) || '0.0'} km/h
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Distance</span>
                      <span className="font-semibold text-blue-400">
                        {currentData?.data?.distance?.toFixed(2) || '0.00'} km
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Session Duration</span>
                      <span className="font-semibold text-purple-400">
                        {formatTime(sessionTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!currentData && (
              <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                <div className="text-gray-400 mb-4">
                  <Bike className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg">Waiting for cycle data...</p>
                  <p className="text-sm mt-2">Make sure your bike is connected and transmitting data</p>
                </div>
                <div className="mt-4 h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            )}
          </>
        )}

        {activeTab === 'Profile' && <Profile />}
      </main>
    </div>
  );
}