'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import { EditorNodes } from '@/lib/editor-nodes';
import { EditorTheme } from '@/lib/editor-theme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { CollaborationPlugin } from './plugins/CollaborationPlugin';

function Placeholder() {
  return <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">Start typing...</div>;
}

export default function CollabEditor({ docId, username }: { docId: string; username?: string }) {
  const initialConfig = {
    editorState: undefined,
    namespace: 'CollabTextEditor',
    nodes: [...EditorNodes],
    onError: (error: Error) => {
      console.error(error);
    },
    theme: EditorTheme,
  };

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
          <CollaborationPlugin id={docId} username={username} />
        </div>
      </div>
    </LexicalComposer>
  );
}
