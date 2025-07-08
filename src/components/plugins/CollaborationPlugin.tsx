'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { CollaborationPlugin as LexicalCollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import { createWebsocketProvider, randomUser } from '@/lib/collaboration';
import { useEffect, useMemo } from 'react';
import { $createParagraphNode, $getRoot, LexicalEditor } from 'lexical';
import type { HistoryState } from '@lexical/history';

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


export function CollaborationPlugin({ id, historyState }: { id: string, historyState: HistoryState }) {
  const [editor] = useLexicalComposerContext();

  const { name, color } = useMemo(() => randomUser(), []);

  useEffect(() => {
    // Add cursor styles to the head
    const styleElement = document.createElement('style');
    styleElement.innerHTML = CursorsCSS;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <LexicalCollaborationPlugin
      id={id}
      providerFactory={(id, yjsDocMap) => createWebsocketProvider(id, yjsDocMap)}
      shouldBootstrap={true}
      username={name}
      cursorColor={color}
      initialEditorState={initialEditorState}
      // @ts-expect-error collabHistory is not in the public types
      collabHistory={historyState}
    />
  );
}
