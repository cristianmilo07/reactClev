import { useState, useRef } from 'react'
import './AddItemModal.css'

function AddItemModal({ isOpen, onClose }) {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  // Sample items to display below (3 items as requested)
  const sampleItems = [
    { id: 1, name: 'Blusa Rosa', emoji: '👚' },
    { id: 2, name: 'Pantalón Negro', emoji: '👖' },
    { id: 3, name: 'Zapatos Negros', emoji: '👠' },
  ]

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <h2 className="modal-title">AÑADIR NUEVO ÍTEM</h2>

        {/* Image Upload Section */}
        <div 
          className={`upload-area ${preview ? 'has-image' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {preview ? (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
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
          <button className="btn-save" disabled={!image}>
            GUARDAR ÍTEM
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddItemModal