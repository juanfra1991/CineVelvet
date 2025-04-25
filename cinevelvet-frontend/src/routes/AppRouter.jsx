// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Reservas from '../pages/Reservas';
import Sala from '../pages/Sala';
import Administrador from '../pages/administrador/Administrador';
import Dashboard from '../pages/administrador/Dashboard';
import Peliculas from '../pages/administrador/Peliculas';
import EditarPelicula from '../pages/administrador/EditarPelicula';
import CrearPelicula from '../pages/administrador/CrearPelicula';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/salas/:salaId" element={<Sala />} />
        <Route path="/administrador" element={<Administrador />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/peliculas" element={<Peliculas />} />
        <Route path="/editar-pelicula/:id" element={<EditarPelicula />} />
        <Route path="/crear-pelicula" element={<CrearPelicula />} />
      </Routes>
    </BrowserRouter>
  );
}
