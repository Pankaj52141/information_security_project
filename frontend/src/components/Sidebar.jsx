import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, ShieldAlert } from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <ShieldAlert color="var(--accent-blue)" size={28} />
        SecOps
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link to="/" className={`sidebar-link ${path === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
        <Link to="/projects" className={`sidebar-link ${path.startsWith('/projects') ? 'active' : ''}`}>
          <FolderKanban size={20} />
          Projects
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
