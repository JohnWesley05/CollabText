'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Collaborator = {
  clientId: number;
  name: string;
  color: string;
};

type CollaborationContextType = {
  collaborators: Collaborator[];
  setCollaborators: (collaborators: Collaborator[]) => void;
};

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export function CollaborationProvider({ children }: { children: ReactNode }) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  return (
    <CollaborationContext.Provider value={{ collaborators, setCollaborators }}>
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
