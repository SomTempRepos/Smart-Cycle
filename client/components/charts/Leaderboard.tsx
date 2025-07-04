import { TrendingUp, Zap, Clock, MapPin, HeartPulse, Activity, BatteryFull } from 'lucide-react';

type AchievementBadge = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
};

export default function AchievementsLeaderboard() {
  const badges: AchievementBadge[] = [
    {
      icon: <Zap className="h-4 w-4" />,
      title: "Speed Demon",
      description: "25+ km/h avg",
      color: "bg-green-500"
    },
    {
      icon: <Clock className="h-4 w-4" />,
      title: "Marathoner",
      description: "1h+ session",
      color: "bg-blue-500"
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      title: "Explorer",
      description: "10+ km ride",
      color: "bg-purple-500"
    },
    {
      icon: <HeartPulse className="h-4 w-4" />,
      title: "Heart Warrior",
      description: "150+ bpm avg",
      color: "bg-red-500"
    }
  ];

  const goals = [
    {
      icon: <Activity className="h-4 w-4" />,
      title: "100km Total Distance",
      progress: 87,
      total: 100,
      color: "text-yellow-400"
    },
    {
      icon: <BatteryFull className="h-4 w-4" />,
      title: "Eco Rider (10+ rides)",
      progress: 7,
      total: 10,
      color: "text-green-400"
    }
  ];

  return (
    <div className="w-full bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-purple-400" />
        Your Cycling Achievements
      </h2>
      
      {/* Current Ranking */}
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

      {/* Badges Earned */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-blue-300">Badges Earned</h3>
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge, index) => (
            <div key={index} className="bg-gray-700 p-3 rounded-lg flex flex-col items-center">
              <div className={`${badge.color} text-white rounded-full h-8 w-8 flex items-center justify-center mb-2`}>
                {badge.icon}
              </div>
              <p className="text-sm font-medium">{badge.title}</p>
              <p className="text-xs text-gray-400 text-center">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Goals */}
      <div>
        <h3 className="text-lg font-medium mb-4 text-blue-300">Next Goals</h3>
        <div className="space-y-3">
          {goals.map((goal, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center">
                <span className={`mr-2 ${goal.color}`}>{goal.icon}</span>
                <span>{goal.title}</span>
              </div>
              <span className="text-sm text-gray-400">{goal.progress}/{goal.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}