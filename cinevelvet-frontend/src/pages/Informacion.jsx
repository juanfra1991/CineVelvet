import React, { useEffect, useState } from 'react';
import HeaderConTabs from '../components/HeaderConTabs';
import { FiMapPin, FiPhone, FiVideo } from 'react-icons/fi';

const Informacion = () => {
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Simula un tiempo de carga de 1.5s
    const timeout = setTimeout(() => {
      setCargando(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="home-container">
      <HeaderConTabs />

      <div className="info-container">
        {cargando ? (
          <div className="loader">
            <div className="loader-small"></div>
          </div>
        ) : (
          <>
            <div className="info-cards">
              <div className="info-card">
                <FiMapPin size={24} />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=30880+Águilas,+Murcia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-clean">
                  <p>Avda. Velvet<br />30880 Águilas, Murcia</p>
                </a>
              </div>
              <div className="info-card">
                <FiPhone size={24} />
                <a
                  href="tel:968000000"
                  className="link-clean">
                  <p>968 00 00 00</p>
                </a>
              </div>
              <div className="info-card">
                <FiVideo size={24} />
                <p>6 Salas<br />1340 Asientos</p>
              </div>
            </div>
            <div className="info-descripcion">
              <p>
                Explora la cartelera de Velvet Cinema. Descubre las últimas películas en proyección y horarios.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Informacion;
