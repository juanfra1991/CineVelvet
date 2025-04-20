import { useEffect, useState } from 'react';
import axios from 'axios';

const Reservas = () => {
  const [sesiones, setSesiones] = useState([]);
  const [butacas, setButacas] = useState([]);
  const [sesionSeleccionada, setSesionSeleccionada] = useState('');
  const [butacasSeleccionadas, setButacasSeleccionadas] = useState([]);
  const [cliente, setCliente] = useState({ nombre: '', email: '', telefono: '' });

  // Cargar sesiones disponibles
  useEffect(() => {
    axios.get('http://localhost:8080/api/sesiones')
      .then(res => setSesiones(res.data))
      .catch(err => console.error('Error al cargar sesiones', err));
  }, []);

  // Cargar butacas según sesión seleccionada
  useEffect(() => {
    if (sesionSeleccionada) {
      axios.get(`http://localhost:8080/api/sesiones/${sesionSeleccionada}/butacas`)
        .then(res => setButacas(res.data))
        .catch(err => console.error('Error al cargar butacas', err));
    }
  }, [sesionSeleccionada]);

  const toggleButaca = (id) => {
    setButacasSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      cliente,
      sesionId: sesionSeleccionada,
      butacasId: butacasSeleccionadas,
    };

    try {
      const res = await axios.post('http://localhost:8080/api/reservas/crear', data, {
        responseType: 'blob' // porque es un PDF
      });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'reserva.pdf';
      link.click();
    } catch (error) {
      console.error('Error al crear la reserva', error);
    }
  };

  return (
    <div>
      <h1>📝 Crear Reserva</h1>
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

        <div>
          <label>Sesión:</label>
          <select value={sesionSeleccionada} onChange={e => setSesionSeleccionada(e.target.value)} required>
            <option value="">Selecciona una sesión</option>
            {sesiones.map(s => (
              <option key={s.id} value={s.id}>
                {s.pelicula.titulo} - {s.fecha}
              </option>
            ))}
          </select>
        </div>

        {butacas.length > 0 && (
          <div>
            <h3>Selecciona butacas</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {butacas.map(b => (
                <button
                  type="button"
                  key={b.id}
                  style={{
                    margin: '5px',
                    padding: '10px',
                    backgroundColor: butacasSeleccionadas.includes(b.id) ? 'green' : 'lightgray',
                  }}
                  onClick={() => toggleButaca(b.id)}
                >
                  {b.fila}-{b.columna}
                </button>
              ))}
            </div>
          </div>
        )}

        <button type="submit">Reservar</button>
      </form>
    </div>
  );
};

export default Reservas;
