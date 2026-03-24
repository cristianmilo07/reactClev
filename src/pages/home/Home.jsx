import { useState } from 'react'
import logoClev from '../../assets/logo.png'
import AddItemModal from '../../components/modal/AddItemModal'
import './Home.css'

function Home() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categories = [
    { id: 'blusas', label: 'Blusas', count: 3 },
    { id: 'abrigos', label: 'Abrigos', count: 1 },
    { id: 'pantalones', label: 'Pantalones', count: 2 },
    { id: 'accesorios', label: 'Accesorios', count: 1 },
    { id: 'calzado', label: 'Calzado', count: 1 },
  ]

  const colors = ['Neutros', 'Estampados']
  const sizes = ['S', 'M', 'L']
  const estados = ['Nuevo', 'Usado']

  const products = [
    { id: 1, name: 'Blusa Rosa', price: '0', emoji: '👚', category: 'blusas' },
    { id: 2, name: 'Blusa Blanca', price: '0', emoji: '👚', category: 'blusas' },
    { id: 3, name: 'Abrigo Beige', price: '$0', emoji: '🧥', category: 'abrigos' },
    { id: 4, name: 'Pantalón Negro', price: '0', emoji: '👖', category: 'pantalones' },
    { id: 5, name: 'Pantalón Azul', price: '0', emoji: '👖', category: 'pantalones' },
    { id: 6, name: 'Bolso Marrón', price: '0', emoji: '👜', category: 'accesorios' },
    { id: 7, name: 'Zapatos Negros', price: '0', emoji: '👠', category: 'calzado' },
    { id: 8, name: 'Blusa Verde', price: '0', emoji: '👚', category: 'blusas' },
  ]

  return (
    <div className="wardrobe-layout">
      {/* Header */}
      <header className="wardrobe-header">
        <div className="header-logo">
          <img src={logoClev} alt="CLEV Logo" className="logo-img" />
        </div>
        
        <nav className="header-nav">
          <a href="#" className="nav-link active">MI ARMARIO</a>
          <a href="#" className="nav-link">OUTFITS</a>
          <a href="#" className="nav-link">BUSCAR</a>
          <a href="#" className="nav-link">CALENDARIO</a>
        </nav>

        <div className="header-actions">
          <button className="search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          <div className="user-avatar">U</div>
        </div>
      </header>

      <div className="wardrobe-body">
        {/* Sidebar */}
        <aside className="wardrobe-sidebar">
          <div className="filter-section">
            <h3 className="filter-title">CATEGORÍA</h3>
            <ul className="filter-list">
              {categories.map((cat) => (
                <li key={cat.id} className="filter-item">
                  <span className={activeFilter === cat.id ? 'active' : ''}>{cat.label}</span>
                  <span className="filter-count">{cat.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">COLOR</h3>
            <ul className="filter-list">
              {colors.map((color) => (
                <li key={color} className="filter-item">
                  <span>{color}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">TALLA</h3>
            <ul className="filter-list size-list">
              {sizes.map((size) => (
                <li key={size} className="filter-item size-item">{size}</li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">ESTADO</h3>
            <ul className="filter-list">
              {estados.map((estado) => (
                <li key={estado} className="filter-item">
                  <span>{estado}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="wardrobe-main">
          <div className="main-header">
            <h1>MI ARMARIO <span className="item-count">(8 ÍTEMS)</span></h1>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <span className="product-emoji">{product.emoji}</span>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Floating Button */}
      <button className="floating-btn" onClick={() => setIsModalOpen(true)}>
        <span className="plus-icon">＋</span>
        <span className="btn-text">AÑADIR ÍTEM</span>
      </button>

      {/* Add Item Modal */}
      <AddItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

export default Home
