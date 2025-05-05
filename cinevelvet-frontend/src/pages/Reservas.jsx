import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Sala.css';
import '../css/Home.css';
import { Config } from '../api/Config';
import logoCinema from '../assets/logoCine.jpg';

const Reservas = () => {
  const location = useLocation();
  const { sesionId, butacasSeleccionadas } = location.state || {};
  const [butacasSeleccionadasState] = useState(butacasSeleccionadas || []);

  const [sesion, setSesiones] = useState([]);
  const [butacas, setButacas] = useState([]);
  const [cliente, setCliente] = useState({ nombre: '', email: '', telefono: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSesion = async () => {
      if (!sesionId) return;

      try {
        const res = await axios.get(`${Config.urlBackend}/sesiones/${sesionId}`);
        setSesiones(res.data);
        console.log("Sesión cargada:", res.data);

        const resButacas = await axios.get(`${Config.urlBackend}/butacas/lista?ids=${butacasSeleccionadas}`);
        setButacas(resButacas.data);
        console.log("butacas: ", resButacas.data);
      } catch (err) {
        console.error('Error al cargar la sesión y butacas:', err);
      }
    };

    fetchSesion();
  }, [sesionId]);

  const crearReserva = async (data) => {
    try {
      const res = await axios.post(`${Config.urlBackend}/reservas`, data);
      alert('Reserva creada exitosamente');
      await descargarPDF(res.data.id);
      navigate('/');
    } catch (error) {
      console.error('Error al crear la reserva', error);
    }
  };

  const descargarPDF = async (reservaId) => {
    try {
      const response = await axios.get(`${Config.urlBackend}/reservas/${reservaId}/pdf`, {
        responseType: 'blob',
      });

      const contentDisposition = response.headers['content-disposition'];
      let filename = "entrada_velvetcinema.pdf";
      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition.split("filename=")[1].replace(/"/g, "");
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (butacasSeleccionadas.length === 0) {
      alert('Por favor, selecciona al menos una butaca.');
      return;
    }

    const data = {
      cliente,
      sesionId,
      butacasId: butacasSeleccionadasState,
    };

    await crearReserva(data);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-background"></div>
        <div className="header-content">
          <img className='logo' src={logoCinema} alt="Cinema Logo" />
          <div>
            <h1 className='title'>Velvet Cinema</h1>
          </div>
        </div>
      </header>
      <p><strong>Velvet Cinema</strong></p>
      <div className="info-pelicula">
        <p><strong>Película: </strong> {sesion.peliculaTitulo}, {sesion.strFechaLarga} {sesion.strHora}, {sesion.salaNombre}</p>
        <p><strong>Selección de butacas: </strong>
          {butacas.map(b => `Fila ${b.fila}, Butaca ${b.butaca}`).join(' | ')}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input value={cliente.nombre} onChange={e => setCliente({ ...cliente, nombre: e.target.value })} required />
        </div>
        <div>
          <label>Email:</label>
          <input value={cliente.email} onChange={e => setCliente({ ...cliente, email: e.target.value })} required />
        </div>
        <div>
          <label>Teléfono:</label>
          <input value={cliente.telefono} onChange={e => setCliente({ ...cliente, telefono: e.target.value })} required />
        </div>
        <button type="submit">Confirmar compra</button>
      </form>
    </div>
  );
};

export default Reservas;
