'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
} from 'lexical';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  CodeIcon,
  StrikethroughIcon,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { mergeRegister } from '@lexical/utils';
import { Button } from '../ui/button';

type ToolbarState = {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
  isLink: boolean;
};

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [toolbarState, setToolbarState] = useState<ToolbarState>({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    isCode: false,
    isLink: false,
  });

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      setToolbarState({
        isBold: selection.hasFormat('bold'),
        isItalic: selection.hasFormat('italic'),
        isUnderline: selection.hasFormat('underline'),
        isStrikethrough: selection.hasFormat('strikethrough'),
        isCode: selection.hasFormat('code'),
        isLink: !!(elementDOM && $isLinkNode(element)),
      });
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
    );
  }, [updateToolbar, editor]);
  
  const formatText = (command: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, command);
  };

  return (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/50 rounded-t-lg">
      <Button variant={toolbarState.isBold ? 'secondary' : 'ghost'} size="icon" onClick={() => formatText('bold')} aria-label="Format Bold">
        <BoldIcon className="w-4 h-4" />
      </Button>
      <Button variant={toolbarState.isItalic ? 'secondary' : 'ghost'} size="icon" onClick={() => formatText('italic')} aria-label="Format Italic">
        <ItalicIcon className="w-4 h-4" />
      </Button>
      <Button variant={toolbarState.isUnderline ? 'secondary' : 'ghost'} size="icon" onClick={() => formatText('underline')} aria-label="Format Underline">
        <UnderlineIcon className="w-4 h-4" />
      </Button>
      <Button variant={toolbarState.isStrikethrough ? 'secondary' : 'ghost'} size="icon" onClick={() => formatText('strikethrough')} aria-label="Format Strikethrough">
        <StrikethroughIcon className="w-4 h-4" />
      </Button>
      <Button variant={toolbarState.isCode ? 'secondary' : 'ghost'} size="icon" onClick={() => formatText('code')} aria-label="Format Code">
        <CodeIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}
