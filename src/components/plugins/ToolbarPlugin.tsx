'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
} from 'lexical';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BoldIcon,
  ChevronDown,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { $isLinkNode } from '@lexical/link';
import { mergeRegister } from '@lexical/utils';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type ToolbarState = {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
  isLink: boolean;
  isAlignLeft: boolean;
  isAlignCenter: boolean;
  isAlignRight: boolean;
  isAlignJustify: boolean;
  fontFamily: string;
};

const FONT_OPTIONS = ['Arial', 'Inter', 'Roboto', 'Playfair Display'];

const getStyleProperty = (style: string, property: string): string => {
    const styleObj = (style || '').split(';')
        .filter(s => s.trim())
        .reduce((acc, s) => {
            const [key, val] = s.split(':').map(p => p.trim());
            if (key && val) acc[key] = val;
            return acc;
        }, {} as Record<string, string>);
    return styleObj[property] || '';
};

const setStyleProperty = (style: string, property: string, value: string): string => {
    const styleObj = (style || '').split(';')
        .filter(s => s.trim())
        .reduce((acc, s) => {
            const [key, val] = s.split(':').map(p => p.trim());
            if (key && val) acc[key] = val;
            return acc;
        }, {} as Record<string, string>);
    styleObj[property] = value;
    return Object.entries(styleObj)
        .map(([key, val]) => `${key}: ${val}`)
        .join('; ');
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
    isAlignLeft: true,
    isAlignCenter: false,
    isAlignRight: false,
    isAlignJustify: false,
    fontFamily: 'Arial',
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
      
      const formatType = element.getFormatType();
      
      const style = anchorNode.getStyle();
      const fontFamily = getStyleProperty(style, 'font-family') || 'Arial';

      setToolbarState({
        isBold: selection.hasFormat('bold'),
        isItalic: selection.hasFormat('italic'),
        isUnderline: selection.hasFormat('underline'),
        isStrikethrough: selection.hasFormat('strikethrough'),
        isCode: selection.hasFormat('code'),
        isLink: !!(elementDOM && $isLinkNode(element)),
        isAlignLeft: formatType === 'left' || formatType === '',
        isAlignCenter: formatType === 'center',
        isAlignRight: formatType === 'right',
        isAlignJustify: formatType === 'justify',
        fontFamily,
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

  const formatElement = (command: 'left' | 'center' | 'right' | 'justify') => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, command);
  };

  const applyFontFamily = (fontFamily: string) => {
    editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            selection.getNodes().forEach(node => {
                if ($isTextNode(node)) {
                    const writableNode = node.getWritable();
                    const style = writableNode.getStyle();
                    const newStyle = setStyleProperty(style, 'font-family', fontFamily);
                    writableNode.setStyle(newStyle);
                }
            });
        }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50 rounded-t-lg">
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
      <Separator orientation="vertical" className="h-6 mx-1" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-32 justify-between">
            <span className="truncate" style={{fontFamily: toolbarState.fontFamily}}>{toolbarState.fontFamily}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {FONT_OPTIONS.map(font => (
            <DropdownMenuItem key={font} onSelect={() => applyFontFamily(font)} className="cursor-pointer">
              <span style={{ fontFamily: font }}>{font}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Separator orientation="vertical" className="h-6 mx-1" />
      <Button variant={toolbarState.isAlignLeft ? 'secondary' : 'ghost'} size="icon" onClick={() => formatElement('left')} aria-label="Align Left">
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button variant={toolbarState.isAlignCenter ? 'secondary' : 'ghost'} size="icon" onClick={() => formatElement('center')} aria-label="Align Center">
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button variant={toolbarState.isAlignRight ? 'secondary' : 'ghost'} size="icon" onClick={() => formatElement('right')} aria-label="Align Right">
        <AlignRight className="w-4 h-4" />
      </Button>
      <Button variant={toolbarState.isAlignJustify ? 'secondary' : 'ghost'} size="icon" onClick={() => formatElement('justify')} aria-label="Align Justify">
        <AlignJustify className="w-4 h-4" />
      </Button>
    </div>
  );
}
