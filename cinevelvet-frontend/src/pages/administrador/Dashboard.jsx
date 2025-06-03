import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FiLogOut } from "react-icons/fi";
import '../../css/Dashboard.css';
import '../../css/Home.css';
import logoCinema from '../../assets/logoCine.jpg';

export default function Dashboard() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Películas", path: "/peliculas" },
    { name: "Sesiones", path: "/sesiones" },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  const handleAnotherAction = () => {
    // Lógica para el nuevo botón
    console.log("Nuevo botón clickeado");
  };

  useEffect(() => {
    if (window.location.pathname === "/administrador") {
      navigate(menuItems[0].path);
    }
  }, []);

  return (
    <div className="peliculas-admin-container">
      <aside>
        <header className="home-header">
        <div className="header-background header-content">
          <button className="admin-icon" onClick={() => window.history.back()} title="Cerrar Sesión">
            <FiLogOut size={24} />
          </button>
          <img className='logo' src={logoCinema} alt="Cinema Logo" />
          <h1 className='title'>Velvet Cinema</h1>
        </div>
      </header>
        <h2 className="dashboard-title">Panel Administrador</h2>
        <nav className="dashboard-nav gap">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`menu-button btn-selected flex-button ${window.location.pathname === item.path ? 'active' : ''}`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </aside>
    </div>
  );
}
