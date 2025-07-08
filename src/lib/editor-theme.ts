import type { EditorThemeClasses } from 'lexical';

export const EditorTheme: EditorThemeClasses = {
  ltr: 'text-left',
  rtl: 'text-right',
  paragraph: 'mb-2',
  quote: 'my-2 pl-4 border-l-4 border-muted',
  heading: {
    h1: 'text-3xl font-bold my-4',
    h2: 'text-2xl font-bold my-3',
    h3: 'text-xl font-bold my-2',
    h4: 'text-lg font-bold my-2',
    h5: 'text-base font-bold my-1',
    h6: 'text-sm font-bold my-1',
  },
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal ml-6 mb-2',
    ul: 'list-disc ml-6 mb-2',
    listitem: 'mb-1',
  },
  link: 'cursor-pointer text-blue-600 hover:underline',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
    code: 'bg-muted p-1 rounded-sm text-sm font-mono',
  },
  code: 'block bg-muted p-2 rounded-md text-sm font-mono whitespace-pre-wrap',
  table: 'w-full border-collapse border border-muted',
  tableCell: 'p-2 border border-muted',
  tableCellHeader: 'bg-muted/50 font-bold',
  tableRow: 'border-b border-muted',
  character: {
    strikethrough: 'line-through',
  },
  embedBlock: {
    base: 'my-2',
    focus: 'ring-2 ring-primary',
  },
  hashtag: 'text-blue-500',
  horizontalRule: 'my-4 border-t border-muted',
};
