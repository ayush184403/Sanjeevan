import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Clock, AlertTriangle, User, CheckCircle } from 'lucide-react';

const Volunteer: React.FC = () => {
  const { requests, assignVolunteer } = useApp();
  // Simulate logged in volunteer ID
  const currentVolunteerId = 'v1'; 

  const pendingRequests = requests.filter(r => r.status === 'PENDING' || r.status === 'SEARCHING');
  const myAssignments = requests.filter(r => r.assignedVolunteerId === currentVolunteerId && r.status !== 'CLOSED');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <User className="text-emergency-600" /> Volunteer Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Nearby Emergencies */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 uppercase tracking-wider border-b pb-2 mb-4">
            Nearby Alerts ({pendingRequests.length})
          </h2>
          
          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No active emergencies in your area.</p>
            </div>
          ) : (
            pendingRequests.map(req => (
              <div key={req.id} className="bg-white rounded-xl shadow-sm border border-l-4 border-l-emergency-500 border-gray-200 p-4 transition hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                   <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                     req.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                   }`}>
                     {req.severity}
                   </span>
                   <span className="text-xs text-gray-400 flex items-center">
                     <Clock size={12} className="mr-1" /> {Math.floor((Date.now() - req.timestamp) / 60000)}m ago
                   </span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{req.incidentType} Incident</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{req.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin size={14} className="mr-1" />
                  {req.location.area}, {req.location.city}
                </div>

                <button 
                  onClick={() => assignVolunteer(req.id, currentVolunteerId)}
                  className="w-full py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors"
                >
                  Accept & Respond
                </button>
              </div>
            ))
          )}
        </div>

        {/* My Assignments */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 uppercase tracking-wider border-b pb-2 mb-4">
            My Active Rescues
          </h2>

          {myAssignments.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
               <p className="text-gray-500">You have no active assignments.</p>
            </div>
          ) : (
            myAssignments.map(req => (
              <div key={req.id} className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-5">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                     <span className="font-bold text-green-800">ACTIVE RESPONSE</span>
                   </div>
                   <span className="font-mono text-xs text-green-700">#{req.id}</span>
                </div>
                
                <div className="bg-white bg-opacity-60 rounded p-3 mb-4">
                   <p className="text-sm font-medium text-gray-800 mb-1">Target Location:</p>
                   <p className="text-lg font-bold text-gray-900 flex items-center">
                      <MapPin size={18} className="mr-1 text-emergency-600" />
                      {req.location.area}, {req.location.city}
                   </p>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600"><strong>Caller:</strong> {req.callerName} ({req.callerPhone})</p>
                  <p className="text-sm text-gray-600"><strong>Note:</strong> {req.description}</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                    Update Status
                  </button>
                  <button className="flex-1 py-2 bg-white border border-green-600 text-green-700 rounded-lg font-medium hover:bg-green-50">
                    Navigate
                  </button>
                </div>
              </div>
            ))
          )}

           {/* Stats Card */}
           <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-2">Volunteer Impact</h3>
              <div className="flex justify-between text-center">
                 <div>
                    <div className="text-2xl font-black text-blue-600">12</div>
                    <div className="text-xs text-blue-400 uppercase">Rescued</div>
                 </div>
                 <div>
                    <div className="text-2xl font-black text-blue-600">4.5h</div>
                    <div className="text-xs text-blue-400 uppercase">Volunteered</div>
                 </div>
                 <div>
                    <div className="text-2xl font-black text-blue-600">4.9</div>
                    <div className="text-xs text-blue-400 uppercase">Rating</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
