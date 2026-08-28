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
import { EDITOR_THEME } from './theme'

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
    <div data-component="LexicalEditor" className="relative bg-[#04080b] border border-[#333333] rounded-lg focus-within:border-[#e10908] transition-colors overflow-hidden select-text" style={{ minHeight }}>
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
