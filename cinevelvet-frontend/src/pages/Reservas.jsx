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
  const [mensajeGuardado, setMensajeGuardado] = useState("");
  const [contador, setContador] = useState(null);
  const [comprando, setComprando] = useState(false);
  const [mostrandoLoader, setMostrandoLoader] = useState(false);

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

  useEffect(() => {
    if (contador !== 5) return;
  
    // Mostrar mensaje inmediatamente
    setMensajeGuardado("Compra realizada correctamente. Serás redirigido en unos segundos...");
  
    // Mostrar loader después de 3 segundos
    const mostrarLoaderTimer = setTimeout(() => {
      setMostrandoLoader(true);
    }, 3000);
  
    // Redirigir después de 8 segundos (3 + 5)
    const redirigirTimer = setTimeout(() => {
      navigate('/');
    }, 8000);
  
    return () => {
      clearTimeout(mostrarLoaderTimer);
      clearTimeout(redirigirTimer);
    };
  }, [contador, navigate]);
  
  const crearReserva = async (data) => {
    setComprando(true);
    try {
      const res = await axios.post(`${Config.urlBackend}/reservas`, data);
      await descargarPDF(res.data.id);
      setContador(5);
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
      {mostrandoLoader && (
      <div className="loader-overlay">
        <div className="loader"></div>
        <p>Redirigiendo al inicio...</p>
      </div>
    )}
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
      <form onSubmit={handleSubmit} className="formulario-reserva">
        <div className="campo-formulario">
          <label>Nombre:</label>
          <input
            value={cliente.nombre}
            onChange={e => setCliente({ ...cliente, nombre: e.target.value })}
            required
          />
        </div>
        <div className="campo-formulario">
          <label>Email:</label>
          <input
            value={cliente.email}
            onChange={e => setCliente({ ...cliente, email: e.target.value })}
            required
          />
        </div>
        <div className="campo-formulario">
          <label>Teléfono:</label>
          <input
            value={cliente.telefono}
            onChange={e => setCliente({ ...cliente, telefono: e.target.value })}
            required
          />
        </div>
        {mensajeGuardado && (
          <div className="popup-mensaje">
            {mensajeGuardado}
          </div>
        )}
        <div className="boton-comprar-container">
          <button
            type="submit"
            className="boton-comprar"
            disabled={comprando}>
            {comprando ? 'Procesando compra...' : 'Confirmar compra'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Reservas;
