import React, { useState } from 'react';
import { 
  Search, Bell, Shield, User, Crown, ChevronDown, CheckCircle, 
  ExternalLink, Sparkles, BookOpen, Video, Award 
} from 'lucide-react';

export function Header({ 
  user, 
  currentRole, 
  onToggleRole, 
  onOpenNotifications, 
  unreadCount,
  onOpenMembershipModal,
  onNavigate,
  searchTerm,
  onSearchChange
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="header-bar">
      {/* Buscador inteligente */}
      <div className="header-search">
        <Search className="header-search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Buscar cursos, clases en vivo, lecciones o recursos..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Acciones principales del Header */}
      <div className="header-actions">
        {/* Conmutador de Rol (Estudiante vs Admin) para probar ambas experiencias */}
        <div className="role-switcher" title="Cambia entre la experiencia de Alumno y el Panel de Administración">
          <button 
            className={`role-btn ${currentRole === 'student' ? 'active' : ''}`}
            onClick={() => onToggleRole('student')}
          >
            <User size={14} />
            <span>Estudiante</span>
          </button>
          <button 
            className={`role-btn admin-role ${currentRole === 'admin' ? 'active' : ''}`}
            onClick={() => onToggleRole('admin')}
          >
            <Shield size={14} />
            <span>Admin CMS</span>
          </button>
        </div>

        {/* Badge de Membresía / Plan Activo */}
        <button 
          className="badge badge-amber" 
          style={{ cursor: 'pointer', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '6px 12px' }}
          onClick={onOpenMembershipModal}
          title="Ver o cambiar plan de membresía"
        >
          <Crown size={14} />
          <span>{user.plan}</span>
        </button>

        {/* Notificaciones */}
        <button 
          className="btn btn-secondary btn-sm" 
          style={{ position: 'relative', padding: '8px 12px', borderRadius: '50%', width: '40px', height: '40px' }}
          onClick={onOpenNotifications}
          title="Notificaciones de clases y recursos"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '10px',
              height: '10px',
              background: '#F43F5E',
              borderRadius: '50%',
              border: '2px solid var(--bg-surface)'
            }} />
          )}
        </button>

        {/* Perfil del Estudiante */}
        <div style={{ position: 'relative' }}>
          <div 
            className="user-pill" 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-plan-tag">
                <Sparkles size={11} /> {user.title.split('en')[0]}
              </span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-dim)' }} />
          </div>

          {/* Menú desplegable de perfil */}
          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              width: '280px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '16px',
              zIndex: 60
            }}>
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '12px' }}>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>{user.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{user.email}</div>
                <div style={{ color: 'var(--emerald-400)', fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>
                  {user.title}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Lecciones completadas:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{user.stats.completedLessons}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Horas de formación:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{user.stats.totalHoursWatched}h</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Asistencia en vivo:</span>
                  <span style={{ fontWeight: 700, color: 'var(--emerald-400)' }}>{user.stats.attendanceRate}</span>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <button 
                  className="btn btn-secondary btn-sm" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenMembershipModal();
                  }}
                >
                  Gestionar Membresía
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
