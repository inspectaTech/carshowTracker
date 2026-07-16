import { useCallback, useMemo } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { $generateHtmlFromNodes } from '@lexical/html'
import {
  ListNode, ListItemNode,
} from '@lexical/list'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { CodeNode, CodeHighlightNode } from '@lexical/code'
import { LinkNode, AutoLinkNode } from '@lexical/link'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import ToolbarPlugin from './ToolbarPlugin'
import ImagePlugin from './ImagePlugin'
import { ImageNode } from './ImageNode'

const EDITOR_THEME = {
  ltr: 'text-left',
  rtl: 'text-right',
  paragraph: 'text-white text-[14px] leading-relaxed mb-2 last:mb-0',
  heading: {
    h1: 'text-white text-[24px] font-bold mb-2',
    h2: 'text-white text-[20px] font-bold mb-2',
    h3: 'text-white text-[18px] font-semibold mb-2',
  },
  list: {
    ul: 'list-disc ml-5 text-white text-[14px] mb-2 space-y-1',
    ol: 'list-decimal ml-5 text-white text-[14px] mb-2 space-y-1',
    listitem: 'text-white text-[14px]',
    nested: {
      listitem: 'list-inside',
    },
  },
  quote: 'border-l-4 border-[#e10908] pl-4 text-[#aaaaaa] text-[14px] italic mb-2',
  code: 'bg-[#1a1d22] text-[#e10908] text-[13px] font-mono p-3 rounded-lg block mb-2 overflow-x-auto',
  codeHighlight: {
    atrule: 'text-[#e10908]',
    attr: 'text-#ffffff',
    boolean: 'text-[#e10908]',
    builtin: 'text-[#e10908]',
    cdata: 'text-[#888888]',
    char: 'text-#ffffff',
    class: 'text-[#e10908]',
    'class-name': 'text-[#e10908]',
    comment: 'text-[#888888]',
    constant: 'text-[#e10908]',
    deleted: 'text-[#ef4444]',
    doctype: 'text-[#888888]',
    entity: 'text-[#e10908]',
    function: 'text-[#e10908]',
    important: 'text-[#e10908]',
    inserted: 'text-[#4ade80]',
    keyword: 'text-[#e10908]',
    number: 'text-[#e10908]',
    operator: 'text-#ffffff',
    prolog: 'text-[#888888]',
    property: 'text-[#e10908]',
    punctuation: 'text-[#888888]',
    regex: 'text-[#e10908]',
    selector: 'text-#ffffff',
    string: 'text-[#4ade80]',
    symbol: 'text-[#e10908]',
    tag: 'text-[#e10908]',
    url: 'text-[#e10908]',
    variable: 'text-[#e10908]',
  },
  link: 'text-[#e10908] underline cursor-pointer hover:text-[#ff3d3d]',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    subscript: 'align-sub text-[0.75em]',
    superscript: 'align-super text-[0.75em]',
    underlineStrikethrough: 'underline line-through',
  },
}

function Placeholder() {
  return (
    <div className="absolute top-3 left-3.5 text-[#555555] text-[14px] pointer-events-none select-none">
      Describe your event...
    </div>
  )
}

export default function LexicalEditor({ initialHtml, onChange, minHeight = 160 }) {
  const onError = useCallback((error) => {
    console.error('[Lexical] Error:', error)
  }, [])

  const handleContentChange = useCallback((editorState, editor) => {
    if (!editorState || !editor) return
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor)
      if (onChange) onChange(html)
    })
  }, [onChange])

  const initialConfig = useMemo(() => ({
    namespace: 'CarshowEventEditor',
    theme: EDITOR_THEME,
    onError,
    nodes: [LinkNode, AutoLinkNode, ListNode, ListItemNode, CodeNode, CodeHighlightNode, ImageNode, HeadingNode, QuoteNode],
  }), [onError])

  return (
    <div data-component="lexical-editor" className="bg-[#04080b] border border-[#333333] rounded-lg focus-within:border-[#e10908] transition-colors overflow-hidden select-text" style={{ minHeight }}>
      <LexicalComposer initialConfig={initialConfig}>
        <ListPlugin />
        <LinkPlugin />
        <HistoryPlugin />
        <ImagePlugin />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="outline-none px-3.5 py-3 min-h-[160px] text-white text-[14px] leading-relaxed select-text"
              style={{ minHeight }}
            />
          }
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />

        <ToolbarPlugin />

        <OnChangePlugin onChange={handleContentChange} />
      </LexicalComposer>
    </div>
  )
}
