'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { CollaborationPlugin as LexicalCollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import { createWebsocketProvider, randomUser } from '@/lib/collaboration';
import { useEffect, useMemo } from 'react';
import { $createParagraphNode, $getRoot, LexicalEditor } from 'lexical';
import { useCollaboration } from '@/context/CollaborationContext';

// CursorsContainer component is not explicitly needed as LexicalCollaborationPlugin handles it.
// The cursors are appended to the body by default, or to a specified container ref.
// We just need to add styles for the cursors.
const CursorsCSS = `
  .y-cursor {
    position: absolute;
    pointer-events: none;
    height: 100%;
    width: 2px;
  }
  .y-cursor-selection {
    position: absolute;
    pointer-events: none;
    opacity: 0.2;
  }
  .y-cursor-label {
    position: absolute;
    pointer-events: none;
    white-space: nowrap;
    font-size: 12px;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    top: -20px;
    left: -2px;
    user-select: none;
  }
`;

const initialEditorState = (editor: LexicalEditor): void => {
  const root = $getRoot();
  if (root.isEmpty()) {
    const p = $createParagraphNode();
    root.append(p);
  }
};


export function CollaborationPlugin({ id, username }: { id: string, username?: string }) {
  const [editor] = useLexicalComposerContext();
  const { setCollaborators } = useCollaboration();

  const { name, color } = useMemo(() => {
    const random = randomUser();
    return {
      name: username || random.name,
      color: random.color,
    };
  }, [username]);

  useEffect(() => {
    // Add cursor styles to the head
    const styleElement = document.createElement('style');
    styleElement.innerHTML = CursorsCSS;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const providerFactory = useMemo(() => (docId: string, yjsDocMap: Map<string, any>) => {
    const provider = createWebsocketProvider(docId, yjsDocMap);
    provider.awareness.on('change', () => {
      const collaborators = Array.from(provider.awareness.getStates().entries()).map(([clientId, state]) => {
        const user = (state as any).user;
        return {
          clientId,
          name: user?.name || 'Anonymous',
          color: user?.color || '#000000',
        };
      });
      setCollaborators(collaborators);
    });
    return provider;
  }, [setCollaborators]);


  return (
    <LexicalCollaborationPlugin
      id={id}
      providerFactory={providerFactory}
      shouldBootstrap={true}
      username={name}
      cursorColor={color}
      initialEditorState={initialEditorState}
    />
  );
}
