import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Circle, Clock, MapPin, Phone, ShieldCheck, User } from 'lucide-react';
import { RescueRequest } from '../types';

const Track: React.FC = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('id');
  const { requests, volunteers } = useApp();
  const [request, setRequest] = useState<RescueRequest | undefined>(undefined);

  useEffect(() => {
    if (requestId) {
      const found = requests.find(r => r.id === requestId);
      setRequest(found);
    }
  }, [requestId, requests]);

  if (!requestId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-gray-400" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Track Rescue Status</h2>
          <p className="text-gray-500 mb-6">Enter your Request ID to check real-time status.</p>
          <input 
            type="text" 
            placeholder="e.g. SOS-829102"
            className="w-full p-3 border rounded-lg mb-4 text-center font-mono uppercase tracking-widest"
          />
          <button className="w-full py-3 bg-emergency-600 text-white rounded-lg font-bold">TRACK</button>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-center">
           <h2 className="text-xl font-bold text-gray-400">Request Not Found</h2>
           <Link to="/" className="text-emergency-600 underline mt-2 inline-block">Return Home</Link>
        </div>
      </div>
    );
  }

  const assignedVolunteer = volunteers.find(v => v.id === request.assignedVolunteerId);
  const steps = ['PENDING', 'SEARCHING', 'ASSIGNED', 'IN_PROGRESS', 'RESCUED'];
  const currentStepIndex = steps.indexOf(request.status) === -1 ? 1 : steps.indexOf(request.status);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-wide">Rescue Status</h1>
            <p className="text-gray-400 text-sm font-mono">ID: {request.id}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            request.status === 'RESCUED' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
          }`}>
            {request.status.replace('_', ' ')}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Progress Bar */}
          <div className="mb-10 relative">
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full"></div>
             <div 
               className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 rounded-full transition-all duration-1000"
               style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
             ></div>
             <div className="relative flex justify-between">
                {steps.slice(1).map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-2 z-10 ${
                        isCompleted ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'
                      }`}></div>
                    </div>
                  )
                })}
             </div>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Assigned Volunteer</p>
                {assignedVolunteer ? (
                  <div className="flex items-center gap-2">
                     <div className="bg-blue-100 p-2 rounded-full">
                        <User size={16} className="text-blue-600" />
                     </div>
                     <div>
                        <p className="font-bold text-gray-800 text-sm">{assignedVolunteer.name}</p>
                        <p className="text-xs text-gray-500">{assignedVolunteer.phone}</p>
                     </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                    Searching nearby...
                  </p>
                )}
             </div>
             
             <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Estimated Arrival</p>
                <p className="text-xl font-black text-gray-800">
                  {assignedVolunteer ? '12 MIN' : '--'}
                </p>
             </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6 relative border-l-2 border-gray-100 ml-3 pl-6 pb-2">
            {request.updates.slice().reverse().map((update, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emergency-100 border-2 border-emergency-500"></div>
                <p className="text-sm font-medium text-gray-800">{update.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                   {new Date(update.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            ))}
          </div>

          {/* AI Analysis Box */}
          {request.aiAnalysis && (
            <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <h3 className="text-xs font-bold text-purple-800 uppercase mb-2 flex items-center">
                <span className="mr-1 text-lg">✨</span> AI Situation Analysis
              </h3>
              <p className="text-sm text-purple-900 leading-relaxed">
                {request.aiAnalysis}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Track;
