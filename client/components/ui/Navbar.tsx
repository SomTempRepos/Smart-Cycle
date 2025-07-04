'use client';

import { useState } from 'react';
import { Bike, ChevronDown, Home, User, Trophy, Map } from 'lucide-react';

interface NavbarProps {
  bikeId: string;
  setBikeId: (bikeId: string) => void;
  availableBikes: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Navbar({ 
  bikeId, 
  setBikeId, 
  availableBikes, 
  activeTab = 'Home',
  onTabChange 
}: NavbarProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const tabs = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Profile', label: 'Profile', icon: User },
    { id: 'Ranks', label: 'Ranks', icon: Trophy },
    { id: 'Map', label: 'Map', icon: Map }
  ];

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Left Side - Firefox Logo and Brand */}
        <div className="flex items-center space-x-4">
          {/* Firefox Logo - Using a styled div as placeholder for now */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              {/* Firefox-style logo using CSS */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
                </div>
              </div>
              {/* Small accent */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-80"></div>
            </div>
            <h1 className="text-xl font-bold text-white">Firefox</h1>
          </div>
        </div>

        {/* Center - Navigation Tabs */}
        <div className="flex items-center space-x-1 bg-gray-700 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side - Bike Selection */}
        <div className="flex items-center space-x-3">
          <Bike className="h-5 w-5 text-blue-400" />
          <div className="relative">
            <select
              value={bikeId}
              onChange={(e) => setBikeId(e.target.value)}
              className="appearance-none bg-gray-700 border border-gray-600 rounded-md py-2 pl-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              {availableBikes.map((bike) => (
                <option key={bike} value={bike} className="bg-gray-700">
                  {bike}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </nav>
  );
}