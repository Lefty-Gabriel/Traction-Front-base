import React from 'react';
import { 
  LayoutDashboard, BookOpen, Radio, Film, FolderDown, 
  Users, MessageSquare, Award, Shield, ArrowUpRight, 
  Sparkles, Compass, CheckCircle2 
} from 'lucide-react';

export function Sidebar({ 
  currentView, 
  onNavigate, 
  currentRole, 
  user, 
  onOpenMembershipModal 
}) {
  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Mis Programas', icon: BookOpen },
    { 
      id: 'live', 
      label: 'Clases en Vivo', 
      icon: Radio, 
      badge: 'Hoy 18:30', 
      badgeType: 'badge-live' 
    },
    { id: 'replays', label: 'Videoteca Replays', icon: Film },
    { id: 'library', label: 'Biblioteca & Recursos', icon: FolderDown },
    { id: 'mentors', label: 'Mentores de Élite', icon: Users },
    { id: 'community', label: 'Comunidad & Red', icon: MessageSquare },
    { id: 'certificates', label: 'Certificaciones', icon: Award }
  ];

  const adminNavItems = [
    { id: 'admin-overview', label: 'Panel General', icon: LayoutDashboard },
    { id: 'admin-courses', label: 'Gestor de Cursos', icon: BookOpen },
    { id: 'admin-live', label: 'Agendar Vivos & Replays', icon: Radio },
    { id: 'admin-users', label: 'Estudiantes & Accesos', icon: Users }
  ];

  return (
    <aside className="sidebar">
      {/* Brand & Logo */}
      <div className="sidebar-brand" style={{ cursor: 'pointer' }} onClick={() => onNavigate('dashboard')}>
        <div className="brand-icon">
          <span>T</span>
        </div>
        <div className="brand-title">
          <span className="brand-name">TRACTION</span>
          <span className="brand-subtitle">Escuela de Negocios</span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="sidebar-nav">
        {currentRole === 'admin' ? (
          <>
            <div className="sidebar-section-title">ADMINISTRACIÓN & CMS</div>
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon size={18} className="nav-icon" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '14px 8px' }} />
            <div className="sidebar-section-title">VISTA PREVIA ESTUDIANTE</div>
          </>
        ) : null}

        <div className="sidebar-section-title">FORMACIÓN & ACELERACIÓN</div>
        {studentNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={18} className="nav-icon" />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`nav-badge ${item.badgeType}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer with Membership status */}
      <div className="sidebar-footer">
        <div className="sidebar-membership-card">
          <div className="membership-header">
            <span className="membership-title">{user.plan}</span>
            <span className="membership-pill">Activo</span>
          </div>
          <p className="membership-desc">
            Acceso ilimitado a clases en vivo, grabaciones y comunidad.
          </p>
          <button 
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', padding: '6px 10px' }}
            onClick={onOpenMembershipModal}
          >
            <span>Ver beneficios de membresía</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
