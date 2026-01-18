import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RescueRequest, Resource, Volunteer, UserRole } from '../types';

interface AppContextType {
  requests: RescueRequest[];
  resources: Resource[];
  volunteers: Volunteer[];
  currentUserRole: UserRole;
  setRole: (role: UserRole) => void;
  addRequest: (request: RescueRequest) => void;
  updateRequestStatus: (id: string, status: RescueRequest['status'], updateMessage?: string) => void;
  assignVolunteer: (requestId: string, volunteerId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// MOCK DATA INITIALIZATION
const INITIAL_RESOURCES: Resource[] = [
  { id: 'r1', name: 'City General Hospital', type: 'HOSPITAL', city: 'Mumbai', availableBeds: 12, contact: '102' },
  { id: 'r2', name: 'Seva Sadan Shelter', type: 'SHELTER', city: 'Mumbai', availableBeds: 5, contact: '9876543210' },
  { id: 'r3', name: 'LifeCare NGO', type: 'NGO', city: 'Delhi', availableBeds: 0, contact: '9988776655' },
  { id: 'r4', name: 'Community Clinic', type: 'HOSPITAL', city: 'Bangalore', availableBeds: 3, contact: '080-123456' },
];

const INITIAL_VOLUNTEERS: Volunteer[] = [
  { id: 'v1', name: 'Rahul Sharma', skills: ['First Aid', 'Driving'], city: 'Mumbai', isAvailable: true, phone: '9000011111' },
  { id: 'v2', name: 'Priya Patel', skills: ['Nursing', 'Counseling'], city: 'Mumbai', isAvailable: true, phone: '9000022222' },
  { id: 'v3', name: 'Amit Singh', skills: ['Social Work'], city: 'Delhi', isAvailable: false, phone: '9000033333' },
  { id: 'v4', name: 'Sneha Gupta', skills: ['First Aid'], city: 'Bangalore', isAvailable: true, phone: '9000044444' },
];

const INITIAL_REQUESTS: RescueRequest[] = [
  {
    id: 'req-101',
    callerName: 'Anonymous',
    callerPhone: 'Hidden',
    location: { city: 'Mumbai', area: 'Andheri West', landmark: 'Near Metro Station' },
    description: 'Elderly man found sleeping on pavement, looks dehydrated.',
    severity: 'MODERATE',
    incidentType: 'ABANDONMENT',
    status: 'ASSIGNED',
    timestamp: Date.now() - 3600000,
    assignedVolunteerId: 'v1',
    updates: [
      { timestamp: Date.now() - 3600000, message: 'Request received.' },
      { timestamp: Date.now() - 1800000, message: 'Volunteer Rahul Sharma assigned.' }
    ]
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<RescueRequest[]>(INITIAL_REQUESTS);
  const [resources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [volunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [currentUserRole, setRole] = useState<UserRole>('CALLER');

  const addRequest = (request: RescueRequest) => {
    setRequests(prev => [request, ...prev]);
  };

  const updateRequestStatus = (id: string, status: RescueRequest['status'], updateMessage?: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        const newUpdates = updateMessage 
          ? [...req.updates, { timestamp: Date.now(), message: updateMessage }]
          : req.updates;
        return { ...req, status, updates: newUpdates };
      }
      return req;
    }));
  };

  const assignVolunteer = (requestId: string, volunteerId: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const vol = volunteers.find(v => v.id === volunteerId);
        return { 
          ...req, 
          status: 'ASSIGNED', 
          assignedVolunteerId: volunteerId,
          updates: [...req.updates, { timestamp: Date.now(), message: `Volunteer ${vol?.name} assigned to the case.` }]
        };
      }
      return req;
    }));
  };

  return (
    <AppContext.Provider value={{ 
      requests, 
      resources, 
      volunteers, 
      currentUserRole, 
      setRole, 
      addRequest, 
      updateRequestStatus,
      assignVolunteer 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
