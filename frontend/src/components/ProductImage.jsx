import React, { useState } from 'react'

function ProductImage({ src, alt, className, fallbackSrc = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop' }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleLoad = () => {
    setImageLoading(false)
  }

  return (
    <div className={`image-container ${className}`}>
      {imageLoading && (
        <div className={`${className} image-loading`}></div>
      )}
      <img
        src={imageError ? fallbackSrc : src}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        style={{ display: imageLoading ? 'none' : 'block' }}
      />
    </div>
  )
}

export default ProductImage