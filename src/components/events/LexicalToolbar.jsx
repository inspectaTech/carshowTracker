import { useCallback } from 'react'
import { UNDO_COMMAND, REDO_COMMAND } from 'lexical'
import {
  Bold, Italic, Underline, List, ListOrdered, Quote, Code, Link as LinkIcon,
  Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Heading1, Heading2, Heading3, Undo2, Redo2,
} from 'lucide-react'

function ToolButton({ active, onClick, children, label, disabled }) {
  return (
    <button
      type="button"
      data-part={`toolbar-${label.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors text-[14px] shrink-0 ${
        disabled
          ? 'text-[#333333] cursor-not-allowed'
          : active
            ? 'bg-[#e10908]/20 text-[#e10908]'
            : 'text-[#888888] hover:text-white hover:bg-[#1a1d22]'
      }`}
    >
      {children}
    </button>
  )
}

export default function LexicalToolbar({ editor, activeFormats, onFormat, layout = 'scroll', canUndo = false, canRedo = false }) {
  const fire = useCallback((format, value) => {
    if (onFormat) onFormat(format, value)
  }, [onFormat])

  const fireUndo = useCallback(() => {
    if (editor) editor.dispatchCommand(UNDO_COMMAND)
  }, [editor])

  const fireRedo = useCallback(() => {
    if (editor) editor.dispatchCommand(REDO_COMMAND)
  }, [editor])

  return (
    <div data-part="lexical-toolbar" className={`flex items-center gap-1 ${layout === 'wrap' ? 'flex-wrap' : 'flex-nowrap w-max'} px-3 py-2 border-b border-[#333333] bg-[#0a0d12] rounded-t-lg`}>
      {/* Undo / Redo */}
      <ToolButton active={false} onClick={fireUndo} label="Undo" disabled={!canUndo}>
        <Undo2 size={16} />
      </ToolButton>
      <ToolButton active={false} onClick={fireRedo} label="Redo" disabled={!canRedo}>
        <Redo2 size={16} />
      </ToolButton>

      <div className="w-px h-6 bg-[#333333] mx-1" />

      {/* Text formatting */}
      <ToolButton active={activeFormats?.bold} onClick={() => fire('bold')} label="Bold">
        <Bold size={16} />
      </ToolButton>
      <ToolButton active={activeFormats?.italic} onClick={() => fire('italic')} label="Italic">
        <Italic size={16} />
      </ToolButton>
      <ToolButton active={activeFormats?.underline} onClick={() => fire('underline')} label="Underline">
        <Underline size={16} />
      </ToolButton>

      <div className="w-px h-6 bg-[#333333] mx-1" />

      {/* Headings */}
      <ToolButton active={activeFormats?.h1} onClick={() => fire('h1')} label="Heading 1">
        <Heading1 size={16} />
      </ToolButton>
      <ToolButton active={activeFormats?.h2} onClick={() => fire('h2')} label="Heading 2">
        <Heading2 size={16} />
      </ToolButton>
      <ToolButton active={activeFormats?.h3} onClick={() => fire('h3')} label="Heading 3">
        <Heading3 size={16} />
      </ToolButton>

      <div className="w-px h-6 bg-[#333333] mx-1" />

      {/* Lists */}
      <ToolButton active={activeFormats?.bullet} onClick={() => fire('bullet')} label="Bullet List">
        <List size={16} />
      </ToolButton>
      <ToolButton active={activeFormats?.ordered} onClick={() => fire('ordered')} label="Numbered List">
        <ListOrdered size={16} />
      </ToolButton>

      <div className="w-px h-6 bg-[#333333] mx-1" />

      {/* Insert */}
      <ToolButton active={activeFormats?.link} onClick={() => fire('link')} label="Link">
        <LinkIcon size={16} />
      </ToolButton>
      <ToolButton active={activeFormats?.image} onClick={() => fire('image')} label="Image">
        <ImageIcon size={16} />
      </ToolButton>

      <div className="w-px h-6 bg-[#333333] mx-1" />

      {/* Alignment */}
      <ToolButton active={activeFormats?.alignLeft} onClick={() => fire('align', 'left')} label="Align Left">
        <AlignLeft size={16} />
      </ToolButton>
      <ToolButton active={activeFormats?.alignCenter} onClick={() => fire('align', 'center')} label="Align Center">
        <AlignCenter size={16} />
      </ToolButton>
      <ToolButton active={activeFormats?.alignRight} onClick={() => fire('align', 'right')} label="Align Right">
        <AlignRight size={16} />
      </ToolButton>
      <ToolButton active={activeFormats?.alignJustify} onClick={() => fire('align', 'justify')} label="Justify">
        <AlignJustify size={16} />
      </ToolButton>
      <ToolButton active={activeFormats?.blockquote} onClick={() => fire('blockquote')} label="Quote">
        <Quote size={16} />
      </ToolButton>
      <ToolButton active={activeFormats?.code} onClick={() => fire('code')} label="Code">
        <Code size={16} />
      </ToolButton>
    </div>
  )
}
