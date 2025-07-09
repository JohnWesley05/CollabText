
'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext';
import { useEffect } from 'react';
import { useCollaboration } from '@/context/CollaborationContext';

export default function AwarenessPlugin() {
  const [editor] = useLexicalComposerContext();
  const { provider } = useCollaborationContext();
  const { setCollaborators } = useCollaboration();

  useEffect(() => {
    if (!provider) return;
    
    const awareness = provider.awareness;

    const onAwarenessChange = () => {
      const collaborators = Array.from(awareness.getStates().entries()).map(
        ([clientId, state]) => {
          const user = (state as any).user;
          return {
            clientId,
            name: user?.name || 'Anonymous',
            color: user?.color || '#000000',
          };
        }
      );
      setCollaborators(collaborators);
    };

    awareness.on('change', onAwarenessChange);
    // Set initial collaborators
    onAwarenessChange();

    return () => {
      awareness.off('change', onAwarenessChange);
    };
  }, [provider, setCollaborators]);

  return null;
}
