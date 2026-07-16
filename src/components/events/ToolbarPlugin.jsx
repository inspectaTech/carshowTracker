import { useCallback, useEffect, useState } from 'react'
import { mergeRegister } from '@lexical/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, CAN_UNDO_COMMAND, CAN_REDO_COMMAND } from 'lexical'
import {
  INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $createCodeNode } from '@lexical/code'
import { $setBlocksType } from '@lexical/selection'
import { TOGGLE_LINK_COMMAND } from '@lexical/link'
import FloatingToolbar from './MobileFloatingToolbar'
import { INSERT_IMAGE_COMMAND } from './ImagePlugin'

const LowPriority = 1

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [activeFormats, setActiveFormats] = useState({})
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setActiveFormats({
        bold: selection.hasFormat('bold'),
        italic: selection.hasFormat('italic'),
        underline: selection.hasFormat('underline'),
      })
    } else {
      setActiveFormats({})
    }
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => { updateToolbar() })
      }),
      editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
        updateToolbar()
        return false
      }, LowPriority),
      editor.registerCommand(CAN_UNDO_COMMAND, (payload) => {
        setCanUndo(payload)
        return false
      }, LowPriority),
      editor.registerCommand(CAN_REDO_COMMAND, (payload) => {
        setCanRedo(payload)
        return false
      }, LowPriority),
    )
  }, [editor, updateToolbar])

  const handleFormat = useCallback((format, value) => {
    switch (format) {
      case 'bold':
      case 'italic':
      case 'underline':
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
        break
      case 'h1':
      case 'h2':
      case 'h3':
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(format))
          }
        })
        break
      case 'bullet':
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        break
      case 'ordered':
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        break
      case 'blockquote':
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode())
          }
        })
        break
      case 'code':
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createCodeNode())
          }
        })
        break
      case 'link':
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, value || null)
        break
      case 'image': {
        const url = window.prompt('Enter image URL:')
        if (url && url.trim()) {
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, url.trim())
        }
        break
      }
      case 'align':
        if (value) editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value)
        break
      default:
        break
    }
  }, [editor])

  return <FloatingToolbar editor={editor} activeFormats={activeFormats} onFormat={handleFormat} canUndo={canUndo} canRedo={canRedo} />
}