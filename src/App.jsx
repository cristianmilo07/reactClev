import { useState } from 'react'
import Login from './pages/login/Login'
import Home from './pages/home/Home'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (credentials) => {
    console.log('Usuario:', credentials.usuario)
    console.log('Contraseña:', credentials.contrasena)
    // Simular autenticación exitosa
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  return (
    <>
      {isAuthenticated ? (
        <Home />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  )
}

export default App
