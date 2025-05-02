import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Reservas = () => {
  const location = useLocation(); // Obtén el estado de la navegación
  const { sesionId, butacasSeleccionadas } = location.state || {}; // Asegúrate de que state no sea undefined

  const [sesiones, setSesiones] = useState([]);
  const [butacas, setButacas] = useState([]);
  const [cliente, setCliente] = useState({ nombre: '', email: '', telefono: '' });

  // Cargar sesiones disponibles
  useEffect(() => {
    axios.get('http://localhost:8080/api/sesiones')
      .then(res => setSesiones(res.data))
      .catch(err => console.error('Error al cargar sesiones', err));
  }, []);

  // Cargar butacas según sesión seleccionada
  useEffect(() => {
    if (sesionId) {
      // Aquí tratamos de obtener las butacas de la sesión
      axios.get(`http://localhost:8080/api/sesiones/${sesionId}`)
        .then(res => {
          // Si la respuesta de la sesión tiene las butacas, las asignamos
          setButacas(res.data.butacas || []);
        })
        .catch(err => console.error('Error al cargar butacas', err));
    }
  }, [sesionId]);

  const toggleButaca = (id) => {
    setButacasSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que haya butacas seleccionadas
    if (butacasSeleccionadas.length === 0) {
      alert('Por favor, selecciona al menos una butaca.');
      return;
    }

    // Construir el objeto de datos que se enviará
    const data = {
      cliente,
      sesionId, // Usamos el sesionId de la navegación
      butacasId: butacasSeleccionadas,
    };

    try {
      const res = await axios.post('http://localhost:8080/api/reservas', data);

      // Si la reserva es exitosa, mostrar algún mensaje o manejar la respuesta
      alert('Reserva creada exitosamente');
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

        {/* Mostrar la sesión seleccionada */}
        {sesionId && (
          <div>
            <label>Sesión Seleccionada:</label>
            <p>{sesionId}</p>
          </div>
        )}

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
