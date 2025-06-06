import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { FiArrowLeftCircle } from 'react-icons/fi';
import logoCinema from '../assets/logoCine.jpg';
import '../css/HeaderConTabs.css';

const HeaderConTabs = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const ruta = location.pathname;

    const platform = Capacitor.getPlatform();
    const mostrarBotonAdmin = platform !== 'ios' && platform !== 'android';

    return (
        <>
            {/* Header completo con título, logo y botón de admin */}
            <header className="home-header">
                <div className="header-background header-content">
                    {mostrarBotonAdmin && (
                        <button className="admin-icon" onClick={() => navigate(-1)} title="Atrás">
                            <FiArrowLeftCircle size={24} />
                        </button>
                    )}
                    <img
                        className="logo"
                        src={logoCinema}
                        alt="Cinema Logo"
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer' }}
                    />
                    <h1 className="title">Velvet Cinema</h1>
                </div>
            </header>

            {/* Pestañas de navegación estilo Multicines */}
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
