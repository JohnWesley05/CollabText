
'use client';

import { useMemo } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import { $createParagraphNode, $getRoot } from 'lexical';

import { EditorNodes } from '@/lib/editor-nodes';
import { EditorTheme } from '@/lib/editor-theme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { createWebsocketProvider, randomUser } from '@/lib/collaboration';
import AwarenessPlugin from './plugins/AwarenessPlugin';


function Placeholder() {
  return <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">Start typing...</div>;
}

const initialEditorState = (editor: any) => {
    const root = $getRoot();
    if (root.isEmpty()) {
        root.append(
            $createParagraphNode()
        );
    }
};

export default function CollabEditor({ docId, username }: { docId: string; username?: string }) {
  const initialConfig = {
    editorState: initialEditorState,
    namespace: 'CollabTextEditor',
    nodes: [...EditorNodes],
    onError: (error: Error) => {
      console.error(error);
    },
    theme: EditorTheme,
  };
  
  const { name, color } = useMemo(() => randomUser(), []);
  const collabUsername = username || name;
  
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="bg-card rounded-lg shadow-lg border">
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[600px] p-4 outline-none resize-none" />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <AutoFocusPlugin />
          <HistoryPlugin />
          <CollaborationPlugin
            id={docId}
            providerFactory={(id, yjsDocMap) => createWebsocketProvider(id, yjsDocMap, { name: collabUsername, color })}
            initialEditorState={initialEditorState}
            shouldBootstrap={true}
          />
          <AwarenessPlugin username={collabUsername} />
        </div>
      </div>
    </LexicalComposer>
  );
}
