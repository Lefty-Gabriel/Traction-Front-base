import React, { useState, useEffect } from 'react';
import { 
  Shield, BookOpen, Radio, Users, Plus, CheckCircle2, 
  Trash2, Edit, Crown, DollarSign, TrendingUp, Calendar, 
  Clock, Sparkles, Filter, Check, AlertCircle, Search, 
  UserPlus, ArrowUpRight, ChevronRight, Activity 
} from 'lucide-react';

export function AdminView({ 
  courses, 
  liveClasses, 
  onAddCourse, 
  onAddLiveClass, 
  mentors,
  currentView = 'admin-overview',
  onNavigate 
}) {
  // Sync tab with sidebar currentView
  const getInitialTab = () => {
    if (currentView === 'admin-courses') return 'courses';
    if (currentView === 'admin-live') return 'live';
    if (currentView === 'admin-users') return 'users';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [showScheduleLiveModal, setShowScheduleLiveModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // Sync state if currentView prop changes externally from the sidebar
  useEffect(() => {
    if (currentView === 'admin-courses') setActiveTab('courses');
    else if (currentView === 'admin-live') setActiveTab('live');
    else if (currentView === 'admin-users') setActiveTab('users');
    else setActiveTab('overview');
  }, [currentView]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (onNavigate) {
      if (tab === 'courses') onNavigate('admin-courses');
      else if (tab === 'live') onNavigate('admin-live');
      else if (tab === 'users') onNavigate('admin-users');
      else onNavigate('admin-overview');
    }
  };

  // Form states for new Course
  const [courseForm, setCourseForm] = useState({
    title: '',
    tagline: '',
    category: 'Ventas Estratégicas',
    level: 'Avanzado',
    mentorName: mentors[0]?.name || 'Sofía Valenzuela',
    estimatedHours: '6.5 horas'
  });

  // Form states for new Live Class
  const [liveForm, setLiveForm] = useState({
    title: '',
    subtitle: '',
    mentorName: mentors[0]?.name || 'Sofía Valenzuela',
    date: 'Próximo Miércoles',
    time: '19:00 (GMT-5)',
    duration: '75 min',
    joinUrl: 'https://zoom.us/j/traction-live-new',
    category: 'Ventas & Crecimiento'
  });

  // Students list state
  const [students, setStudents] = useState([
    { id: 'st_1', name: 'Alejandro Morales', company: 'ScaleTech', email: 'alejandro@scaletech.io', plan: 'Scale Pass', status: 'Activo', joined: 'Ene 2026' },
    { id: 'st_2', name: 'Valeria Gómez', company: 'FinPay LatAm', email: 'valeria@finpay.com', plan: 'Executive Council', status: 'Activo', joined: 'Feb 2026' },
    { id: 'st_3', name: 'Mateo Carvajal', company: 'LogiFast', email: 'mateo@logifast.co', plan: 'Scale Pass', status: 'Activo', joined: 'Ene 2026' },
    { id: 'st_4', name: 'Ignacio Silva', company: 'SaaSify', email: 'ignacio@saasify.app', plan: 'Growth Pass', status: 'Activo', joined: 'Mar 2026' },
    { id: 'st_5', name: 'Mariana Duarte', company: 'HealthPulse', email: 'mariana@healthpulse.io', plan: 'Growth Pass', status: 'Pendiente Pago', joined: 'Hace 3 días' },
    { id: 'st_6', name: 'Rodrigo Albarracín', company: 'NubeLogistics', email: 'rodrigo@nubelog.com', plan: 'Scale Pass', status: 'Activo', joined: 'Ene 2026' }
  ]);

  // Student filter & search state
  const [studentSearch, setStudentSearch] = useState('');
  const [studentPlanFilter, setStudentPlanFilter] = useState('all');

  // New student form
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    company: '',
    email: '',
    plan: 'Scale Pass'
  });

  const handleCreateCourseSubmit = (e) => {
    e.preventDefault();
    if (!courseForm.title.trim()) return;

    const newCourseObj = {
      id: `course_${Date.now()}`,
      title: courseForm.title,
      tagline: courseForm.tagline,
      category: courseForm.category,
      level: courseForm.level,
      mentorName: courseForm.mentorName,
      mentorRole: 'Mentor Oficial',
      mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      progressPercent: 0,
      completedLessonsCount: 0,
      totalLessonsCount: 8,
      estimatedHours: courseForm.estimatedHours,
      isEnrolled: true,
      rating: 5.0,
      modules: []
    };

    onAddCourse(newCourseObj);
    setShowCreateCourseModal(false);
    setCourseForm({
      title: '',
      tagline: '',
      category: 'Ventas Estratégicas',
      level: 'Avanzado',
      mentorName: mentors[0]?.name || 'Sofía Valenzuela',
      estimatedHours: '6.5 horas'
    });
  };

  const handleScheduleLiveSubmit = (e) => {
    e.preventDefault();
    if (!liveForm.title.trim()) return;

    const newLiveObj = {
      id: `live_${Date.now()}`,
      title: liveForm.title,
      subtitle: liveForm.subtitle,
      mentorName: liveForm.mentorName,
      mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      date: liveForm.date,
      time: liveForm.time,
      duration: liveForm.duration,
      isToday: false,
      isLiveNow: false,
      joinUrl: liveForm.joinUrl,
      attendeesCount: 0,
      category: liveForm.category,
      badge: 'Programada'
    };

    onAddLiveClass(newLiveObj);
    setShowScheduleLiveModal(false);
  };

  const handleUpdateStudentPlan = (studentId, newPlan) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, plan: newPlan };
      }
      return s;
    }));
  };

  const handleAddStudentSubmit = (e) => {
    e.preventDefault();
    if (!newStudentForm.name.trim() || !newStudentForm.email.trim()) return;

    const newStudent = {
      id: `st_${Date.now()}`,
      name: newStudentForm.name,
      company: newStudentForm.company || 'Empresa Independiente',
      email: newStudentForm.email,
      plan: newStudentForm.plan,
      status: 'Activo',
      joined: 'Hoy'
    };

    setStudents([newStudent, ...students]);
    setNewStudentForm({ name: '', company: '', email: '', plan: 'Scale Pass' });
    setShowAddStudentModal(false);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.company.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesPlan = studentPlanFilter === 'all' || s.plan.toLowerCase().includes(studentPlanFilter.toLowerCase());
    return matchesSearch && matchesPlan;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header del CMS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-amber">
              <Shield size={14} />
              <span>Panel de Control Administrativo (CMS)</span>
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>
            Gestión Integral de Traction
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Control central de programas, clases en vivo, profesores, alumnos y niveles de suscripción.
          </p>
        </div>
      </div>

      {/* Métricas Globales del Negocio */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="stat-value">1,480</div>
            <div className="stat-label">Alumnos Activos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--gold-400)' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div className="stat-value">$142,500</div>
            <div className="stat-label">MRR Recurrente</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan-400)' }}>
            <Radio size={22} />
          </div>
          <div>
            <div className="stat-value">{liveClasses.length}</div>
            <div className="stat-label">Sesiones Programadas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="stat-value">74%</div>
            <div className="stat-label">Tasa de Finalización</div>
          </div>
        </div>
      </div>

      {/* Pestañas de Gestión (sincronizadas 100% con la barra lateral) */}
      <div className="tabs-nav">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => handleTabChange('overview')}
        >
          Panel General
        </button>
        <button 
          className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => handleTabChange('courses')}
        >
          Gestor de Cursos ({courses.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => handleTabChange('live')}
        >
          Agendar Vivos & Replays ({liveClasses.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => handleTabChange('users')}
        >
          Estudiantes & Accesos ({students.length})
        </button>
      </div>

      {/* ============================================================== */}
      {/* VISTA 1: PANEL GENERAL (OVERVIEW)                               */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Accesos Rápidos para Administrador */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div 
              className="card card-interactive" 
              onClick={() => handleTabChange('courses')}
              style={{ cursor: 'pointer', background: 'var(--bg-surface)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="badge badge-emerald">Cursos</span>
                <ChevronRight size={16} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#FFF' }}>Publicar o Modificar Cursos</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {courses.length} programas activos en la plataforma.
              </p>
            </div>

            <div 
              className="card card-interactive" 
              onClick={() => handleTabChange('live')}
              style={{ cursor: 'pointer', background: 'var(--bg-surface)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="badge badge-amber">Clases en Vivo</span>
                <ChevronRight size={16} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#FFF' }}>Agendar Nueva Clase en Vivo</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {liveClasses.length} sesiones agendadas con mentores.
              </p>
            </div>

            <div 
              className="card card-interactive" 
              onClick={() => handleTabChange('users')}
              style={{ cursor: 'pointer', background: 'var(--bg-surface)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="badge badge-purple">Accesos</span>
                <ChevronRight size={16} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#FFF' }}>Gestionar Membresías de Alumnos</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {students.length} estudiantes registrados recientemente.
              </p>
            </div>
          </div>

          {/* Actividad Reciente de la Escuela */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Activity size={18} style={{ color: 'var(--emerald-400)' }} />
              <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Actividad Reciente del Negocio</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg-deep)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>
                    Alejandro Morales completó la lección "3.1 Framework SPICED"
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Machine de Ventas B2B • Hace 12 minutos</div>
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '11px' }}>Progreso</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg-deep)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>
                    Valeria Gómez actualizó su plan a "Executive Council" ($199/mes)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>FinPay LatAm • Facturación confirmada • Hace 1 hora</div>
                </div>
                <span className="badge badge-amber" style={{ fontSize: '11px' }}>Upgrade</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg-deep)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>
                    Sofía Valenzuela confirmó la sala para el taller de hoy a las 18:30
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>142 alumnos confirmados en lista de asistencia</div>
                </div>
                <span className="badge badge-live" style={{ fontSize: '11px' }}>En Vivo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VISTA 2: GESTOR DE CURSOS & MÓDULOS                             */}
      {/* ============================================================== */}
      {activeTab === 'courses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Programas y Módulos Curriculares</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Crea y gestiona la estructura de cursos, módulos y lecciones de video.</p>
            </div>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setShowCreateCourseModal(true)}
              style={{ gap: '6px' }}
            >
              <Plus size={16} />
              <span>Publicar Nuevo Curso</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {courses.map((course) => (
              <div 
                key={course.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    style={{ width: '60px', height: '45px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>{course.title}</h4>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Mentor: <strong style={{ color: 'var(--text-main)' }}>{course.mentorName}</strong> • {course.category} • {course.estimatedHours}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-emerald">Activo & Publicado</span>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => alert(`Editando contenido curricular de: "${course.title}"`)}
                  >
                    <Edit size={14} />
                    <span>Editar Contenido</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VISTA 3: GESTIÓN DE CLASES EN VIVO & REPLAYS                    */}
      {/* ============================================================== */}
      {activeTab === 'live' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Agenda de Clases en Vivo & Videoteca</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Programa nuevas transmisiones o conviértelas en grabaciones disponibles.</p>
            </div>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setShowScheduleLiveModal(true)}
              style={{ gap: '6px' }}
            >
              <Plus size={16} />
              <span>Agendar Nueva Sesión en Vivo</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {liveClasses.map((item) => (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-live" style={{ fontSize: '11px' }}>{item.badge}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.date} • {item.time}</span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>{item.title}</h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                    Mentor: {item.mentorName} • Link: {item.joinUrl}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => alert(`Clase "${item.title}" guardada exitosamente como grabación (Replay) en la videoteca de alumnos.`)}
                    title="Al finalizar la clase, conviértela en video grabado para la plataforma"
                  >
                    <Radio size={14} />
                    <span>Convertir en Replay Grabado</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VISTA 4: ESTUDIANTES & GESTIÓN DE ACCESOS POR MEMBRESÍA         */}
      {/* ============================================================== */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Gestión de Estudiantes & Accesos por Membresía</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Modifica los permisos de cada alumno para habilitar cursos grabados, vivos semanales o clínicas ejecutivas 1 a 1.
              </p>
            </div>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddStudentModal(true)}
              style={{ gap: '6px' }}
            >
              <UserPlus size={16} />
              <span>Registrar / Invitar Alumno</span>
            </button>
          </div>

          {/* Filtros y Buscador de Estudiantes */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'Growth Pass', 'Scale Pass', 'Executive Council'].map((plan) => (
                <button
                  key={plan}
                  onClick={() => setStudentPlanFilter(plan)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: studentPlanFilter === plan ? '1px solid var(--emerald-500)' : '1px solid var(--border-subtle)',
                    background: studentPlanFilter === plan ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
                    color: studentPlanFilter === plan ? 'var(--emerald-400)' : 'var(--text-muted)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {plan === 'all' ? 'Todos los Planes' : plan}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input 
                type="text" 
                placeholder="Buscar por nombre, empresa o email..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: '#FFF',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Tabla de Estudiantes */}
          <div style={{ overflowX: 'auto', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-deep)', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Estudiante</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Empresa</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Nivel de Acceso (Plan)</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Estado</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Cambiar Nivel de Acceso</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 600, color: '#FFF' }}>
                      {student.name}
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{student.email} • Registrado: {student.joined}</div>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>{student.company}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className={student.plan.includes('Executive') ? 'badge badge-amber' : 'badge badge-emerald'}>
                        <Crown size={12} /> {student.plan}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ color: student.status === 'Activo' ? 'var(--emerald-400)' : '#F59E0B', fontWeight: 600 }}>
                        {student.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <select 
                        value={student.plan}
                        onChange={(e) => handleUpdateStudentPlan(student.id, e.target.value)}
                        style={{
                          background: 'var(--bg-deep)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          color: '#FFF',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Growth Pass">Growth Pass (Solo Grabados)</option>
                        <option value="Scale Pass">Scale Pass (Grabados + Vivos + Replays)</option>
                        <option value="Executive Council">Executive Council (Total + Mentoría 1 a 1)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Registrar Alumno */}
      {showAddStudentModal && (
        <div className="modal-backdrop" onClick={() => setShowAddStudentModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Registrar Nuevo Estudiante</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Asigna los datos y el nivel de membresía inicial para otorgar acceso.</p>
            </div>

            <form onSubmit={handleAddStudentSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Nombre Completo
                </label>
                <input 
                  type="text"
                  placeholder="Ej: Daniel Castillo"
                  value={newStudentForm.name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-deep)', border: '1px solid var(--border-medium)', color: '#FFF', fontSize: '13px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Empresa / Negocio
                </label>
                <input 
                  type="text"
                  placeholder="Ej: InnoScale B2B"
                  value={newStudentForm.company}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, company: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-deep)', border: '1px solid var(--border-medium)', color: '#FFF', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Correo Corporativo
                </label>
                <input 
                  type="email"
                  placeholder="daniel@innoscale.com"
                  value={newStudentForm.email}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-deep)', border: '1px solid var(--border-medium)', color: '#FFF', fontSize: '13px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Nivel de Membresía Asignado
                </label>
                <select 
                  value={newStudentForm.plan}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, plan: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-deep)', border: '1px solid var(--border-medium)', color: '#FFF', fontSize: '13px' }}
                >
                  <option value="Growth Pass">Growth Pass ($49/mes - Cursos grabados)</option>
                  <option value="Scale Pass">Scale Pass ($99/mes - Cursos + Vivos + Replays)</option>
                  <option value="Executive Council">Executive Council ($199/mes - Acceso Total + Mentoría 1 a 1)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddStudentModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Otorgar Acceso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Crear Curso */}
      {showCreateCourseModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateCourseModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Publicar Nuevo Programa Curricular</h3>
            </div>

            <form onSubmit={handleCreateCourseSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Título del Programa
                </label>
                <input 
                  type="text"
                  placeholder="Ej: Levantamiento de Capital Serie A para Startups"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-deep)', border: '1px solid var(--border-medium)', color: '#FFF', fontSize: '13px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Tagline / Promesa de Valor
                </label>
                <input 
                  type="text"
                  placeholder="Ej: Prepara tu Data Room, métricas de retención y pitch deck institucional."
                  value={courseForm.tagline}
                  onChange={(e) => setCourseForm({ ...courseForm, tagline: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-deep)', border: '1px solid var(--border-medium)', color: '#FFF', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Categoría
                  </label>
                  <select 
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-deep)', border: '1px solid var(--border-medium)', color: '#FFF', fontSize: '13px' }}
                  >
                    <option value="Ventas Estratégicas">Ventas Estratégicas</option>
                    <option value="Finanzas & Runway">Finanzas & Runway</option>
                    <option value="Growth & Producto">Growth & Producto</option>
                    <option value="Liderazgo & Equipos">Liderazgo & Equipos</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Mentor Asignado
                  </label>
                  <select 
                    value={courseForm.mentorName}
                    onChange={(e) => setCourseForm({ ...courseForm, mentorName: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-deep)', border: '1px solid var(--border-medium)', color: '#FFF', fontSize: '13px' }}
                  >
                    {mentors.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowCreateCourseModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Crear Programa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Agendar Clase en Vivo */}
      {showScheduleLiveModal && (
        <div className="modal-backdrop" onClick={() => setShowScheduleLiveModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Agendar Nueva Clase en Vivo</h3>
            </div>

            <form onSubmit={handleScheduleLiveSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Tema de la Sesión
                </label>
                <input 
                  type="text"
                  placeholder="Ej: Auditoría en vivo de Modelos Financieros"
                  value={liveForm.title}
                  onChange={(e) => setLiveForm({ ...liveForm, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-deep)', border: '1px solid var(--border-medium)', color: '#FFF', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Fecha y Horario
                  </label>
                  <input 
                    type="text"
                    value={liveForm.time}
                    onChange={(e) => setLiveForm({ ...liveForm, time: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-deep)', border: '1px solid var(--border-medium)', color: '#FFF', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Mentor
                  </label>
                  <select 
                    value={liveForm.mentorName}
                    onChange={(e) => setLiveForm({ ...liveForm, mentorName: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-deep)', border: '1px solid var(--border-medium)', color: '#FFF', fontSize: '13px' }}
                  >
                    {mentors.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowScheduleLiveModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Agendar Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
