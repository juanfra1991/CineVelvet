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
    <div className="home-container">
      <aside>
        <header className="home-header">
          <div className="header-background"></div>
          <div className="header-content">
            <img className='logo' src={logoCinema} alt="Cinema Logo" />
            <div>
              <h1 className='title'>Velvet Cinema</h1>
            </div>
          </div>
        </header>
        <h2 className="dashboard-title">Panel Administrador</h2>
        <nav className="dashboard-nav ">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`menu-button flex-button ${window.location.pathname === item.path ? 'active' : ''}`}
            >
              {item.name}
            </button>
          ))}
        </nav>
        <div className="boton-comprar-container">
                <button className="boton-comprar" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
      </aside>
    </div>
  );
}
