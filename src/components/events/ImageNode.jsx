import { useCallback, useState } from 'react'
import { DecoratorNode, $applyNodeReplacement } from 'lexical'
import { ImageIcon } from 'lucide-react'

function BrokenImagePlaceholder({ src }) {
  return (
    <div
      className="inline-flex flex-col items-center justify-center w-[200px] h-[120px] bg-[#1a1d22] border border-[#333333] rounded-lg text-[#555555] gap-1"
      title={`Broken image: ${src}`}
    >
      <ImageIcon size={24} />
      <span className="text-[11px]">Image not available</span>
    </div>
  )
}

function ImageComponent({ src, altText }) {
  const [failed, setFailed] = useState(false)

  const handleError = useCallback(() => {
    setFailed(true)
  }, [])

  if (failed) {
    return <BrokenImagePlaceholder src={src} />
  }

  return (
    <img
      src={src}
      alt={altText || ''}
      onError={handleError}
      className="inline-block max-w-full rounded-lg my-1"
      style={{ maxHeight: 300 }}
      draggable={false}
    />
  )
}

export class ImageNode extends DecoratorNode {
  __src
  __altText

  static getType() {
    return 'image'
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__altText, node.__key)
  }

  constructor(src, altText, key) {
    super(key)
    this.__src = src
    this.__altText = altText || ''
  }

  static importJSON(serializedNode) {
    return $createImageNode(serializedNode.src, serializedNode.altText)
  }

  exportJSON() {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
    }
  }

  getSrc() {
    return this.__src
  }

  setSrc(src) {
    const writable = this.getWritable()
    writable.__src = src
  }

  getAltText() {
    return this.__altText
  }

  setAltText(altText) {
    const writable = this.getWritable()
    writable.__altText = altText
  }

  createDOM() {
    const span = document.createElement('span')
    span.className = 'inline-block'
    return span
  }

  updateDOM() {
    return false
  }

  decorate() {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
      />
    )
  }
}

export function $createImageNode(src, altText) {
  return $applyNodeReplacement(new ImageNode(src, altText))
}

export function $isImageNode(node) {
  return node instanceof ImageNode
}
