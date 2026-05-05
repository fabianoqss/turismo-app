import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Splash from './pages/Splash'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Preferencias from './pages/Preferencias'
import Home from './pages/Home'
import Roteiro from './pages/Roteiro' 
import Perfil from './pages/Perfil'
import Passaporte from './pages/Passaporte'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/preferencias" element={<Preferencias />} />
        <Route path="/home" element={<Home />} />
        <Route path="/roteiro" element={<Roteiro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/passaporte" element={<Passaporte />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App