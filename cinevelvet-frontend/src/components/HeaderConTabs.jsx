import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import logoCinema from '../assets/logoCine.jpg';
import '../css/HeaderConTabs.css';

const HeaderConTabs = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const ruta = location.pathname;

    return (
        <>
            <header className="home-header">
                <div className="header-background header-content">
                    <button className="admin-icon" onClick={() => navigate('/administrador')}>
                        <FiSettings size={24} />
                    </button>
                    <img className='logo' src={logoCinema} alt="Logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
                    <h1 className='title'>Velvet Cinema</h1>
                </div>
            </header>

            {/* Tabs estilo completo */}
            <div className="tabs-full-container">
                <div
                    className={`tab-full ${ruta === '/' ? 'activo' : ''}`}
                    onClick={() => navigate('/')}
                >
                    Programación
                </div>
                <div
                    className={`tab-full ${ruta === '/informacion' ? 'activo' : ''}`}
                    onClick={() => navigate('/informacion')}
                >
                    Información
                </div>
            </div>
        </>
    );
};

export default HeaderConTabs;
