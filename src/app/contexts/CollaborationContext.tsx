'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Collaboration } from '@/app/types';

interface CollaborationContextType {
  collaborations: Collaboration[];
  sendCollaborationRequest: (projectId: string, businessUserId: string, message: string) => void;
  getCollaborationsForUser: () => Collaboration[];
  getCollaborationsForProject: (projectId: string) => Collaboration[];
  updateCollaborationStatus: (collaborationId: string, status: 'accepted' | 'rejected') => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export function CollaborationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);

  useEffect(() => {
    // Load collaborations from localStorage on initial load
    const storedCollaborations = localStorage.getItem('collaborations');
    if (storedCollaborations) {
      try {
        const parsedCollaborations = JSON.parse(storedCollaborations);
        // Convert timestamp strings back to Date objects
        const collaborationsWithDates = parsedCollaborations.map((collab: Collaboration) => ({
          ...collab,
          createdAt: new Date(collab.createdAt),
        }));
        setCollaborations(collaborationsWithDates);
      } catch (error) {
        console.error('Error parsing stored collaborations:', error);
        localStorage.removeItem('collaborations');
      }
    }
  }, []);

  useEffect(() => {
    // Save collaborations to localStorage whenever they change
    localStorage.setItem('collaborations', JSON.stringify(collaborations));
  }, [collaborations]);

  const sendCollaborationRequest = (projectId: string, businessUserId: string, message: string) => {
    if (!user) return;
    
    const newCollaboration: Collaboration = {
      id: Date.now().toString(),
      projectId,
      businessUserId, // business user sending the request
      studentUserId: 'student_placeholder', // This would be the actual student user ID in a real app
      status: 'pending',
      message,
      createdAt: new Date(),
    };
    
    setCollaborations(prev => [...prev, newCollaboration]);
  };

  const getCollaborationsForUser = () => {
    if (!user) return [];
    
    // For business users, show requests they've sent
    // For student users, show requests they've received
    return collaborations.filter(collab => 
      (user.userType === 'business' && collab.businessUserId === user.id) ||
      (user.userType === 'student' && collab.studentUserId === user.id)
    );
  };

  const getCollaborationsForProject = (projectId: string) => {
    return collaborations.filter(collab => collab.projectId === projectId);
  };

  const updateCollaborationStatus = (collaborationId: string, status: 'accepted' | 'rejected') => {
    setCollaborations(prev => 
      prev.map(collab => 
        collab.id === collaborationId ? { ...collab, status } : collab
      )
    );
  };

  const value = {
    collaborations,
    sendCollaborationRequest,
    getCollaborationsForUser,
    getCollaborationsForProject,
    updateCollaborationStatus,
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
}