'use client';

import { Bike, User, Mail, Phone, Calendar, Plus, MapPin, UserCircle } from 'lucide-react';

export default function Profile() {
  // Demo user data
  const user = {
    name: 'Somnath Jha',
    email: 'somnath.jha@example.com',
    phone: '+91 9876543210',
    age: 28,
    location: 'Bangalore, India',
    avatar: '/default-avatar.png' // Replace with your avatar path
  };

  // Demo wards data
  const wards = [
    { id: 1, name: 'Cycle 01', connectedSince: '15 May 2023' },
    { id: 2, name: 'Cycle 02', connectedSince: '20 June 2023' },
    { id: 3, name: 'Cycle 03', connectedSince: '10 July 2023' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* User Profile Card */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="relative h-32 w-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-blue-500/30">
              <UserCircle className="h-20 w-20 text-gray-400" />
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                <div className="h-3 w-3 rounded-full bg-green-400 border-2 border-gray-800"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center md:text-left">{user.name}</h2>
          </div>
          
          {/* User Details Section */}
          <div className="flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Mail className="h-5 w-5 mr-3 text-blue-400" />
                  <span className="text-gray-300 font-medium">Email</span>
                </div>
                <p className="text-white ml-8">{user.email}</p>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Phone className="h-5 w-5 mr-3 text-blue-400" />
                  <span className="text-gray-300 font-medium">Phone</span>
                </div>
                <p className="text-white ml-8">{user.phone}</p>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 mr-3 text-blue-400" />
                  <span className="text-gray-300 font-medium">Age</span>
                </div>
                <p className="text-white ml-8">{user.age} years</p>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <MapPin className="h-5 w-5 mr-3 text-blue-400" />
                  <span className="text-gray-300 font-medium">Location</span>
                </div>
                <p className="text-white ml-8">{user.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Wards Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center text-white">
            <Bike className="h-6 w-6 mr-3 text-purple-400" />
            <span>Manage Your Cycles</span>
          </h3>
          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Add New Cycle
          </button>
        </div>
        
        <div className="space-y-3">
          {wards.map((ward) => (
            <div key={ward.id} className="bg-gray-700/50 hover:bg-gray-700/70 rounded-lg p-4 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-500/20 p-3 rounded-full">
                    <Bike className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{ward.name}</p>
                    <p className="text-sm text-gray-400">Connected since {ward.connectedSince}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium px-3 py-1 bg-blue-500/10 rounded">
                    View
                  </button>
                  <button className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1 bg-red-500/10 rounded">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}