import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical'
import { $createImageNode } from './ImageNode'

export const INSERT_IMAGE_COMMAND = createCommand('INSERT_IMAGE_COMMAND')

export default function ImagePlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const unregister = editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (url) => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const imageNode = $createImageNode(url, 'Event image')
            selection.insertNodes([imageNode])
          }
        })
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
    return () => unregister()
  }, [editor])

  return null
}
