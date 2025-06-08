import React, { useEffect, useState } from 'react';
import { Config } from '../api/Config';
import axios from 'axios';
import HeaderConTabs from '../components/HeaderConTabs';
import { FiMapPin, FiPhone, FiVideo } from 'react-icons/fi';

const Informacion = () => {
  const [cargando, setCargando] = useState(true);
  const [totalSalas, setTotalSalas] = useState(0);
  const [totalAsientos, setTotalAsientos] = useState(0);

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const res = await axios.get(`${Config.urlBackend}/salas`);
        const salas = res.data;
        setTotalSalas(salas.length);
        const sumaAsientos = salas.reduce((butacas, sala) => butacas + (sala.capacidad || 0), 0);
        setTotalAsientos(sumaAsientos);
      } catch (err) {
        console.error('Error al cargar las salas:', err);
        setTotalSalas(0);
        setTotalAsientos(0);
      } finally {
        setTimeout(() => setCargando(false), 1500);
      }
    };

    fetchSalas();
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
                  <p>
                    Avda. Velvet
                    <br />
                    30880 Águilas, Murcia
                  </p>
                </a>
              </div>
              <div className="info-card">
                <FiPhone size={24} />
                <a href="tel:968000000" className="link-clean">
                  <p>968 00 00 00</p>
                </a>
              </div>
              <div className="info-card">
                <FiVideo size={24} />
                <p>
                  {totalSalas} Sala{totalSalas !== 1 ? 's' : ''}
                  <br />
                  {totalAsientos} Asiento{totalAsientos !== 1 ? 's' : ''}
                </p>
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
