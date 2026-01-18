import React, { useState } from 'react';
import { AlertCircle, MapPin, Phone, Send, Loader2, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeIncident } from '../services/geminiService';
import { RescueRequest } from '../types';
import { useNavigate } from 'react-router-dom';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];

const Emergency: React.FC = () => {
  const { addRequest } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Mumbai',
    area: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // AI Analysis (Simulated or Real via Gemini)
    const analysis = await analyzeIncident(formData.description);

    const newRequest: RescueRequest = {
      id: `SOS-${Date.now().toString().slice(-6)}`,
      callerName: formData.name || 'Anonymous',
      callerPhone: formData.phone || 'N/A',
      location: {
        city: formData.city,
        area: formData.area,
      },
      description: formData.description,
      severity: analysis.severity,
      incidentType: analysis.type,
      status: 'SEARCHING',
      timestamp: Date.now(),
      aiAnalysis: analysis.summary,
      updates: [{ timestamp: Date.now(), message: 'SOS Signal Broadcasted.' }]
    };

    // Artificial delay for effect
    setTimeout(() => {
      addRequest(newRequest);
      setIsLoading(false);
      navigate(`/track?id=${newRequest.id}`);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col">
      {/* Hero Header */}
      <div className="bg-emergency-600 text-white px-6 py-10 pb-16 rounded-b-3xl shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-black rounded-full blur-3xl"></div>
        </div>
        <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase">Call For Help</h1>
        <p className="text-emergency-100 text-lg max-w-md mx-auto">
          Instant connection to nearest volunteers and care facilities for abandoned individuals.
        </p>
      </div>

      {/* Main Form Container - Overlapping the Hero */}
      <div className="flex-1 px-4 -mt-10 pb-10">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-900 px-4 py-3 flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs font-mono text-gray-300 uppercase tracking-widest">System Online • GPS Active</span>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Location Section */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                <MapPin className="inline w-4 h-4 mr-1 text-emergency-600" /> Location
              </label>
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emergency-500 outline-none font-medium"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  required
                >
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input 
                  type="text" 
                  placeholder="Area / Landmark"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emergency-500 outline-none"
                  value={formData.area}
                  onChange={e => setFormData({...formData, area: e.target.value})}
                  required
                />
              </div>
              <button type="button" className="text-xs text-blue-600 flex items-center font-semibold hover:underline">
                 <Navigation size={12} className="mr-1"/> Use current GPS location
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
               <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                <AlertCircle className="inline w-4 h-4 mr-1 text-emergency-600" /> Situation
              </label>
              <textarea 
                rows={4}
                placeholder="Describe the emergency... (e.g. Unconscious elderly man near central park gate, bleeding from head)"
                className="w-full p-4 bg-red-50 border border-red-100 rounded-lg focus:ring-2 focus:ring-emergency-500 outline-none placeholder-gray-400"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              ></textarea>
            </div>

            {/* Contact (Optional) */}
            <div className="space-y-2">
               <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                <Phone className="inline w-4 h-4 mr-1 text-emergency-600" /> Your Contact (Optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                 <input 
                  type="text" 
                  placeholder="Name"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emergency-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emergency-500 outline-none"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            {/* SOS Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 rounded-xl text-white font-black text-xl tracking-widest uppercase shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3
                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emergency-600 hover:bg-emergency-700 shadow-red-200'}
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" /> SEND SOS
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400">
              By sending SOS, you agree to share location data with responders.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
