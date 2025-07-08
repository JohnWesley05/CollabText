'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type CollaborationContextType = {
  collaboratorCount: number;
  setCollaboratorCount: (count: number) => void;
};

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export function CollaborationProvider({ children }: { children: ReactNode }) {
  const [collaboratorCount, setCollaboratorCount] = useState(1); // Start with 1 for the current user

  return (
    <CollaborationContext.Provider value={{ collaboratorCount, setCollaboratorCount }}>
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
