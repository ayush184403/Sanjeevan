import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Building2, Users, AlertTriangle } from 'lucide-react';

const Admin: React.FC = () => {
  const { requests, resources, volunteers } = useApp();

  const stats = [
    { title: 'Active Emergencies', value: requests.filter(r => r.status !== 'CLOSED' && r.status !== 'RESCUED').length, color: 'bg-red-500', icon: AlertTriangle },
    { title: 'Active Volunteers', value: volunteers.filter(v => v.isAvailable).length, color: 'bg-blue-500', icon: Users },
    { title: 'Available Beds', value: resources.reduce((acc, curr) => acc + curr.availableBeds, 0), color: 'bg-green-500', icon: Building2 },
  ];

  const cityData = requests.reduce((acc: any, curr) => {
    acc[curr.location.city] = (acc[curr.location.city] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(cityData).map(city => ({
    name: city,
    incidents: cityData[city]
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Command Center</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
             <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.title}</p>
                <p className="text-4xl font-black text-gray-900 mt-1">{stat.value}</p>
             </div>
             <div className={`${stat.color} p-4 rounded-full text-white bg-opacity-90`}>
                <stat.icon size={24} />
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Map Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-gray-800 mb-4">Resource Heatmap</h2>
           <div className="bg-gray-100 w-full h-80 rounded-lg flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/b/bd/Google_Maps_Logo_2020.svg')] bg-cover opacity-5"></div>
              <div className="grid grid-cols-3 gap-8 text-center z-10">
                 {resources.map(r => (
                   <div key={r.id} className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${r.availableBeds > 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                      <span className="text-xs font-bold mt-1 text-gray-600">{r.city}</span>
                   </div>
                 ))}
              </div>
              <p className="absolute bottom-4 text-xs text-gray-400">Live Simulation • {resources.length} Nodes Online</p>
           </div>
        </div>

        {/* Analytics Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-gray-800 mb-4">Incidents by Region</h2>
           <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                 <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis fontSize={12} tickLine={false} axisLine={false} />
                 <Tooltip 
                    cursor={{fill: '#f3f4f6'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                 <Bar dataKey="incidents" fill="#dc2626" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#dc2626' : '#ef4444'} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

      </div>

      {/* Recent Activity Log */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
           <h3 className="font-bold text-gray-700">Recent System Activity</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {requests.slice(0, 5).map(req => (
            <div key={req.id} className="p-4 hover:bg-gray-50 transition flex justify-between items-center">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${req.status === 'RESCUED' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                    <span className="font-bold text-gray-800 text-sm">#{req.id}</span>
                    <span className="text-xs text-gray-400 uppercase">• {req.incidentType}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate max-w-md">{req.description}</p>
               </div>
               <span className="text-xs font-mono text-gray-400">{new Date(req.timestamp).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
