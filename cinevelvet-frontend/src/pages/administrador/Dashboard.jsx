import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import '../../css/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Películas", path: "/peliculas" },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    if (window.location.pathname === "/administrador") {
      navigate(menuItems[0].path);
    }
  }, []);

  return (
    <div className="dashboard-container">
      {/* Barra superior con el botón de Cerrar Sesión */}
      <div className="dashboard-header">
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>

      {/* Menú lateral */}
      <aside className="dashboard-sidebar">
        <h2 className="dashboard-title">Panel Admin 🎬</h2>
        <nav className="dashboard-nav">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`menu-button ${window.location.pathname === item.path ? 'active' : ''}`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Zona de contenido */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
