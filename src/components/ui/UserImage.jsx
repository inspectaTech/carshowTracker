import { useState } from 'react'

const gradients = [
  'linear-gradient(135deg, #e10908 0%, #ff6b35 50%, #ffd700 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #2d2d2d 100%)',
  'linear-gradient(135deg, #e10908 0%, #8b0000 50%, #4a0000 100%)',
  'linear-gradient(135deg, #2d2d2d 0%, #e10908 50%, #2d2d2d 100%)',
]

function hashUserId(userId = '') {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getPlaceholderGradient(userId) {
  return gradients[hashUserId(userId) % gradients.length]
}

export default function UserImage({
  src,
  alt = '',
  userId = 'user_001',
  className = '',
  width,
  height,
  rounded = false,
  ...props
}) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div
        data-component="UserImage"
        className={`${className} ${rounded ? 'rounded-full' : 'rounded-lg'}`}
        style={{
          width: width || '100%',
          height: height || '100%',
          background: getPlaceholderGradient(userId),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff44',
          fontSize: '0.75rem',
          overflow: 'hidden',
        }}
        aria-label={alt || 'Image placeholder'}
      />
    )
  }

  return (
    <img
      data-component="UserImage"
      src={src}
      alt={alt}
      loading="lazy"
      className={`${className} ${rounded ? 'rounded-full' : 'rounded-lg'} object-cover`}
      style={{ width: width || '100%', height: height || '100%' }}
      onError={() => setHasError(true)}
      {...props}
    />
  )
}
