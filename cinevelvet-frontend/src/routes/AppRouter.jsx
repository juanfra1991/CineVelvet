// AppRouter.tsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Reservas from '../pages/Reservas';
import Sala from '../pages/Sala';
import Administrador from '../pages/administrador/Administrador';
import Dashboard from '../pages/administrador/InicioAdministrador';
import Peliculas from '../pages/administrador/Peliculas';
import EditarPelicula from '../pages/administrador/EditarPelicula';
import Sesiones from '../pages/administrador/Sesiones';
import EditarSesion from '../pages/administrador/EditarSesion';
import Informacion from '../pages/Informacion';


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reservas" element={<Reservas />} />
      <Route path="/salas/:salaId/sesion/:sesionId" element={<Sala />} />
      <Route path="/administrador" element={<Administrador />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/peliculas" element={<Peliculas />} />
      <Route path="/editar-pelicula/:id" element={<EditarPelicula />} />
      <Route path="/sesiones" element={<Sesiones />} />
      <Route path="/editar-sesion/:id" element={<EditarSesion />} />
      <Route path="/informacion" element={<Informacion />} />
    </Routes>
  );
}
