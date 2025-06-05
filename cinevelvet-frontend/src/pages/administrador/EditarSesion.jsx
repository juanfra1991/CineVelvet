import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Config } from '../../api/Config';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import logoCinema from '../../assets/logoCine.jpg';
import { FiArrowLeftCircle } from "react-icons/fi";
import { es } from 'date-fns/locale';
import '../../css/Sesiones.css';

const EditarSesion = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [sesion, setSesion] = useState(null);
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [fecha, setFecha] = useState(null);
  const [peliculaId, setPeliculaId] = useState('');
  const [salaId, setSalaId] = useState('');
  const [mensajeGuardado, setMensajeGuardado] = useState('');
  const [otrasSesiones, setOtrasSesiones] = useState([]);
  const peliculaSeleccionada = peliculas.find(p => p.id === Number(peliculaId));
  const salaSeleccionada = salas.find(s => s.id === Number(salaId));

  const fetchSesion = async () => {
    try {
      const res = await axios.get(`${Config.urlBackend}/sesiones/${id}`);
      const data = res.data;
      setSesion(data);
      setPeliculaId(data.peliculaId.toString());
      setSalaId(data.salaId.toString());
      setFecha(new Date(data.fecha));
    } catch (error) {
      console.error('Error al obtener la sesión:', error);
    }
  };

  const fetchPeliculas = async () => {
    try {
      const res = await axios.get(`${Config.urlBackend}/peliculas/publicadas`);
      setPeliculas(res.data);
    } catch (error) {
      console.error('Error al obtener las películas:', error);
    }
  };

  const fetchSalas = async () => {
    try {
      const res = await axios.get(`${Config.urlBackend}/salas/sin-sesiones-sin-butacas`);
      setSalas(res.data);
    } catch (error) {
      console.error('Error al obtener las salas:', error);
    }
  };

  const fetchSesionesExistentes = async () => {
    try {
      const res = await axios.get(`${Config.urlBackend}/sesiones/futuras`);
      // Filtramos para excluir la sesión actual
      const filtradas = res.data.filter(s => s.id !== Number(id));
      setOtrasSesiones(filtradas);
    } catch (error) {
      console.error('Error al obtener sesiones existentes:', error);
    }
  };

  useEffect(() => {
    fetchSesion();
    fetchPeliculas();
    fetchSalas();
    fetchSesionesExistentes();
  }, []);

  const handleActualizarSesion = async () => {
    console.log({ fecha, salaId, peliculaId });

    if (!fecha || !salaId || !peliculaId) {
      setMensajeGuardado("Debes completar todos los campos.");
      setTimeout(() => setMensajeGuardado(""), 3000);
      return;
    }

    // Verifica si ya hay otra sesión en esa sala a la misma hora
    const conflicto = otrasSesiones.some(s =>
      s.salaId === Number(salaId) &&
      new Date(s.fecha).getTime() === new Date(fecha).getTime()
    );

    if (conflicto) {
      setMensajeGuardado("Ya hay otra sesión en esa sala a la misma hora.");
      setTimeout(() => setMensajeGuardado(""), 3000);
      return;
    }

    try {
      const sesionActualizada = {
        fecha: fecha.toISOString(),
        pelicula: { id: peliculaId },
        sala: { id: salaId },
      };

      await axios.put(`${Config.urlBackend}/sesiones/${id}`, sesionActualizada);

      setMensajeGuardado("Sesión actualizada correctamente.");
      setTimeout(() => {
        setMensajeGuardado("");
        navigate(-1);
      }, 3000);
    } catch (error) {
      console.error('Error al actualizar la sesión:', error);
      setMensajeGuardado("Error al actualizar la sesión.");
      setTimeout(() => setMensajeGuardado(""), 3000);
    }
  };

  if (!sesion) return <div>Cargando sesión...</div>;

  return (
    <div className="sesiones-admin-container home-container">
      <header className="home-header">
        <div className="header-background">
          <button className="admin-icon" onClick={() => window.history.back()} title="Cerrar Sesión">
            <FiArrowLeftCircle size={24} />
          </button>
        </div>
        <div className="header-content">
          <img className='logo' src={logoCinema} alt="Cinema Logo" />
          <h1 className='title'>Velvet Cinema</h1>
        </div>
      </header>

      <h2>Editar Sesión</h2>

      <p className='center'><strong>Película: {sesion?.peliculaTitulo || 'Cargando...'}</strong></p>
      <p className='center'><strong>Sala: {sesion?.salaNombre || 'Cargando...'}</strong></p>
      <p className='center'><strong>Fecha: {fecha ? fecha.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
        : 'Cargando...'}
      </strong></p>
      <hr></hr>

      <div className="formulario-editar">
        <div className="campo">
          <label>Fecha de la sesión:</label>
          <DatePicker
            selected={fecha}
            onChange={(date) => setFecha(date)}
            showTimeSelect
            timeIntervals={5}
            dateFormat="Pp"
            className="input-field"
            locale={es}
            placeholderText="Selecciona una fecha y hora"
          />
        </div>

        <div className="campo">
          <label>Sala:</label>
          <select
            value={salaId}
            onChange={(e) => setSalaId(e.target.value)}
            className="input-field"
          >
            {salas.map((sala) => (
              <option key={sala.id} value={sala.id}>
                {sala.nombre} (Capacidad: {sala.capacidad})
              </option>
            ))}
          </select>
        </div>
        {mensajeGuardado && (
          <div className="popup-mensaje-peliculas">
            {mensajeGuardado}
          </div>
        )}
        <button onClick={handleActualizarSesion} className="btn">
          Actualizar Sesión
        </button>
      </div>
    </div>
  );
};

export default EditarSesion;
