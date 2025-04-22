// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Reservas from '../pages/Reservas';
import Sala from '../pages/Sala';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/salas/:salaId" element={<Sala />} />
      </Routes>
    </BrowserRouter>
  );
}
