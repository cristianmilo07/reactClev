import { useState, useRef, useEffect } from 'react'
import * as imglyRemoveBackground from '@imgly/background-removal'
import './AddItemModal.css'

function AddItemModal({ isOpen, onClose }) {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [processedPreview, setProcessedPreview] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [itemName, setItemName] = useState('')
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  // Sample items to display below (3 items as requested)
  const sampleItems = [
    { id: 1, name: 'Blusa Rosa', emoji: '👚' },
    { id: 2, name: 'Pantalón Negro', emoji: '👖' },
    { id: 3, name: 'Zapatos Negros', emoji: '👠' },
  ]

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Stop camera when modal closes
  useEffect(() => {
    if (!isOpen && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      setIsCameraActive(false)
    }
  }, [isOpen])

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsCameraActive(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('No se pudo acceder a la cámara. Verifica los permisos.')
    }
  }

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    
    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
      setImage(file)
      setProcessedPreview(null)
      setPreview(canvas.toDataURL('image/jpeg'))
      handleCloseCamera()
    }, 'image/jpeg')
  }

  const handleCloseCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    setIsCameraActive(false)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setProcessedPreview(null)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setPreview(null)
    setProcessedPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveBackground = async () => {
    if (!image) return
    
    setIsProcessing(true)
    try {
      const blob = await imglyRemoveBackground.removeBackground(image, {
        progress: (key, current, total) => {
          console.log(`Downloading model: ${key}: ${current} of ${total}`)
        }
      })
      
      const url = URL.createObjectURL(blob)
      setProcessedPreview(url)
    } catch (error) {
      console.error('Error removing background:', error)
      alert('Error al quitar el fondo. Intenta de nuevo.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleResetToOriginal = () => {
    setProcessedPreview(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      setProcessedPreview(null)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  if (!isOpen) return null

  const displayPreview = processedPreview || preview

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <h2 className="modal-title">AÑADIR NUEVO ÍTEM</h2>

        {/* Image Upload Section */}
        <div 
          className={`upload-area ${displayPreview ? 'has-image' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {isCameraActive ? (
            <div className="camera-view">
              <video ref={videoRef} autoPlay playsInline className="camera-video" />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div className="camera-controls">
                <button className="btn-capture" onClick={handleCapturePhoto}>
                  📸 Capturar
                </button>
                <button className="btn-cancel-camera" onClick={handleCloseCamera}>
                  ✕ Cerrar
                </button>
              </div>
            </div>
          ) : displayPreview ? (
            <div className="image-preview">
              <img src={displayPreview} alt="Preview" />
              <button className="remove-image-btn" onClick={handleRemoveImage}>
                ×
              </button>
            </div>
          ) : (
            <>
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <p className="upload-text">Arrastra una imagen o haz clic para seleccionar</p>
              <p className="upload-hint">Formatos: JPG, PNG, WebP</p>
              <div className="upload-buttons">
                <button className="btn-camera" onClick={handleOpenCamera}>
                  📷 Cámara
                </button>
              </div>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="file-input"
          />
        </div>

        {/* Background Removal Options */}
        {preview && !isProcessing && (
          <div className="bg-options">
            {processedPreview ? (
              <button className="btn-reset-bg" onClick={handleResetToOriginal}>
                ↩️ Restablecer original
              </button>
            ) : (
              <button className="btn-remove-bg" onClick={handleRemoveBackground}>
                🎨 Quitar fondo
              </button>
            )}
          </div>
        )}

        {isProcessing && (
          <div className="processing-indicator">
            <div className="spinner"></div>
            <span>Quitando fondo... (descargando modelo)</span>
          </div>
        )}

        {/* Item Name Input */}
        <div className="name-input-section">
          <input
            type="text"
            className="name-input"
            placeholder="Nombre del ítem"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>

        {/* Sample Items Section */}
        <div className="items-section">
          <h3 className="items-title">SELECCIONA UNA CATEGORÍA</h3>
          <div className="items-grid">
            {sampleItems.map((item) => (
              <div key={item.id} className="item-card">
                <div className="item-emoji">{item.emoji}</div>
                <span className="item-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            CANCELAR
          </button>
          <button className="btn-save" disabled={!image && !itemName}>
            GUARDAR ÍTEM
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddItemModal