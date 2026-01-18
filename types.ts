export type UserRole = 'CALLER' | 'VOLUNTEER' | 'ADMIN';

export type Severity = 'CRITICAL' | 'MODERATE' | 'LOW';
export type IncidentType = 'MEDICAL' | 'SHELTER' | 'ABANDONMENT' | 'OTHER';
export type RequestStatus = 'PENDING' | 'SEARCHING' | 'ASSIGNED' | 'RESCUED' | 'CLOSED';

export interface Location {
  city: string;
  area: string;
  landmark?: string;
  lat?: number;
  lng?: number;
}

export interface Resource {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'NGO' | 'SHELTER' | 'POLICE';
  city: string;
  availableBeds: number;
  contact: string;
  distance?: number; // Simulated distance
}

export interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  city: string;
  isAvailable: boolean;
  phone: string;
  distance?: number; // Simulated distance
}

export interface RescueRequest {
  id: string;
  callerName: string;
  callerPhone: string;
  location: Location;
  description: string;
  severity: Severity;
  incidentType: IncidentType;
  status: RequestStatus;
  timestamp: number;
  assignedVolunteerId?: string;
  assignedResourceId?: string;
  updates: {
    timestamp: number;
    message: string;
  }[];
  aiAnalysis?: string;
}

export interface AiAnalysisResult {
  severity: Severity;
  type: IncidentType;
  summary: string;
  recommendedAction: string;
}
