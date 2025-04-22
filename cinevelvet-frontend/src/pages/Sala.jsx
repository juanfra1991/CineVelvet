import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/Sala.css';
import { Config } from '../api/Config';
 

const Sala = () => {
    const { salaId } = useParams(); // <- captura el ID desde la URL
    console.log(salaId)
    const [sala, setSala] = useState(null);
    const [loading, setLoading] = useState(true);
    const[butacas,setButacas] = useState(null);

    useEffect(() => {
        const fetchSala = async () => {
            try {
                const response = await axios.get(`${Config.urlBackend}/butacas/sala/${salaId}`);

                console.log("sala: ",response)

                setSala(response.data);
            } catch (error) {
                console.error("Error al cargar la sala:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSala();
    }, [salaId]);

    if (loading) return <p>Cargando sala...</p>;
    if (!sala) return <p>No se encontró la sala.</p>;

    return (
        <div>
            <h2>{sala.nombre}</h2>
            <p>{sala.filas} filas x {sala.columnas} columnas</p>

            <div className="sala-grid" style={{
                gridTemplateColumns: `repeat(${sala.columnas}, 1fr)`
            }}>
                {sala.butacas.map((butaca, index) => (
                    <div key={butaca.id} className="butaca">
                        {index + 1}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sala;
