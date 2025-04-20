// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Peliculas from '../pages/Peliculas';
import Reservas from '../pages/Reservas';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/peliculas" element={<Peliculas />} />
        <Route path="/reservas" element={<Reservas />} />
      </Routes>
    </BrowserRouter>
  );
}
