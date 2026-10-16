import React, { useState, useEffect } from 'react';
import { 
  Play, Radio, Clock, Award, BookOpen, ArrowRight, 
  Sparkles, TrendingUp, CheckCircle2, Download, Users, 
  Calendar, Flame, ChevronRight, FileSpreadsheet, FileText 
} from 'lucide-react';

export function DashboardView({ 
  user, 
  courses, 
  liveClasses, 
  onSelectCourse, 
  onSelectLesson, 
  onOpenLiveSession, 
  onNavigate 
}) {
  // Countdown timer for today's live session
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 44, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredLive = liveClasses[0];
  const activeCourse = courses[0]; // Active course with progress

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Saludo y Métricas de Alto Impacto */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-emerald">
              <Sparkles size={13} />
              <span>Plataforma Ejecutiva</span>
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Periodo Q4 • Enfoque en Escala
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Hola, {user.name.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '4px' }}>
            Tu hoja de ruta para acelerar <strong style={{ color: 'var(--text-main)' }}>ScaleTech</strong> esta semana.
          </p>
        </div>

        {/* Tarjetas de Métricas Ejecutivas */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)' }}>
              <BookOpen size={22} />
            </div>
            <div>
              <div className="stat-value">{user.stats.coursesInProgress}</div>
              <div className="stat-label">Cursos en Curso</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan-400)' }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="stat-value">{user.stats.completedLessons}</div>
              <div className="stat-label">Lecciones Superadas</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--gold-400)' }}>
              <Clock size={22} />
            </div>
            <div>
              <div className="stat-value">{user.stats.totalHoursWatched}h</div>
              <div className="stat-label">Horas Invertidas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Principal: Próxima Clase en Vivo con Contador Regresivo */}
      {featuredLive && (
        <div className="live-banner">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span className="badge badge-live">
                  <Radio size={14} />
                  <span>EN VIVO HOY</span>
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {featuredLive.time} • Sala Privada
                </span>
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', lineHeight: '1.3' }}>
                {featuredLive.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px', lineHeight: '1.5' }}>
                {featuredLive.subtitle}
              </p>

              {/* Mentor y Alumnos Registrados */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img 
                    src={featuredLive.mentorAvatar} 
                    alt={featuredLive.mentorName} 
                    style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--emerald-500)' }} 
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{featuredLive.mentorName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--emerald-400)' }}>Head of Sales B2B</div>
                  </div>
                </div>

                <div style={{ height: '24px', width: '1px', background: 'var(--border-subtle)' }} />

                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  <Users size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                  <strong>142 alumnos</strong> confirmados
                </div>
              </div>
            </div>

            {/* Contador y Botones de Acción */}
            <div style={{
              background: 'rgba(9, 13, 22, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', fontWeight: 700 }}>
                La sesión comienza en
              </span>

              {/* Ticking Numbers */}
              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Horas</div>
                </div>
                <div style={{ fontSize: '28px', color: 'var(--emerald-400)', fontWeight: 800 }}>:</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Min</div>
                </div>
                <div style={{ fontSize: '28px', color: 'var(--emerald-400)', fontWeight: 800 }}>:</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--emerald-400)', fontVariantNumeric: 'tabular-nums' }}>
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Seg</div>
                </div>
              </div>

              {/* Botón para entrar a la sala */}
              <button 
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px 20px', fontSize: '14px' }}
                onClick={() => onOpenLiveSession(featuredLive)}
              >
                <Radio size={16} />
                <span>Entrar a la Sala en Vivo</span>
              </button>

              <button 
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', fontSize: '12px' }}
                onClick={() => onNavigate('live')}
              >
                Ver Agenda Completa y Materiales
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sección Continuar Aprendiendo (Resume Card) */}
      {activeCourse && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-surface-elevated))',
          borderColor: 'rgba(16, 185, 129, 0.25)',
          padding: '24px 28px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} style={{ color: '#F97316' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                Continuar donde te quedaste
              </span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--emerald-400)' }}>
              {activeCourse.progressPercent}% Completado
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--emerald-400)', fontWeight: 600, marginBottom: '4px' }}>
                {activeCourse.category} • Módulo 3
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
                {activeCourse.title}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Siguiente lección: <strong>3.2 Cómo estructurar una Demo que no aburra (El enfoque de 3 historias)</strong>
              </p>

              {/* Barra de progreso */}
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="progress-bar-container" style={{ height: '8px', flex: 1 }}>
                  <div className="progress-bar-fill" style={{ width: `${activeCourse.progressPercent}%` }} />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                  {activeCourse.completedLessonsCount} de {activeCourse.totalLessonsCount} lecciones
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => {
                  onSelectCourse(activeCourse);
                  onSelectLesson('les_08');
                }}
              >
                <Play size={18} fill="currentColor" />
                <span>Reanudar Lección (35 min)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Mis Programas Activos */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>Mis Programas de Negocio</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Formación estructurada por módulos y casos de estudio reales.</p>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('courses')}
            style={{ gap: '6px' }}
          >
            <span>Explorar catálogo completo</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {courses.map((course) => (
            <div 
              key={course.id}
              className="card card-interactive"
              style={{ display: 'flex', flexDirection: 'column' }}
              onClick={() => onSelectCourse(course)}
            >
              {/* Imagen de portada */}
              <div style={{ position: 'relative', height: '170px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '16px' }}>
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10, 14, 23, 0.85) 0%, transparent 60%)'
                }} />

                <span className="badge badge-emerald" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  {course.category}
                </span>

                <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#FFF', fontWeight: 600 }}>
                    {course.estimatedHours}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--gold-300)', fontWeight: 700 }}>
                    ★ {course.rating}
                  </span>
                </div>
              </div>

              {/* Información del Curso */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px', lineHeight: '1.3' }}>
                  {course.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '16px' }}>
                  {course.tagline}
                </p>

                {/* Mentor Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto', marginBottom: '16px' }}>
                  <img 
                    src={course.mentorAvatar} 
                    alt={course.mentorName} 
                    style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                  />
                  <div style={{ fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{course.mentorName}</span>
                    <span style={{ color: 'var(--text-dim)', marginLeft: '6px' }}>• {course.mentorRole}</span>
                  </div>
                </div>

                {/* Progreso */}
                <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Progreso</span>
                    <span style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>{course.progressPercent}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${course.progressPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fila Dividida: Biblioteca Rápida de Herramientas y Replays Recientes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Herramientas & Plantillas */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>Plantillas y Modelos Descargables</h3>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('library')}
            >
              Ver biblioteca
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-deep)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>Simulador Financiero Runway 36m</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Excel • 3.4 MB • 1,420 descargas</div>
                </div>
              </div>
              <button 
                className="btn btn-secondary btn-sm" 
                title="Descargar plantilla"
                onClick={() => alert('Descargando Simulador Financiero Runway 36m (Excel)...')}
              >
                <Download size={14} />
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-deep)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--cyan-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>Playbook de Ventas & Scripts B2B</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Notion • Enlace directo • 980 descargas</div>
                </div>
              </div>
              <button 
                className="btn btn-secondary btn-sm" 
                title="Descargar playbook"
                onClick={() => alert('Abriendo Playbook de Ventas en Notion...')}
              >
                <Download size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Novedades & Networking de Alumnos */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>Debates en la Comunidad</h3>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('community')}
            >
              Ir al foro
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-deep)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--emerald-400)', fontWeight: 700, marginBottom: '4px' }}>
                #VentasB2B • Debate Activo
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF', lineHeight: '1.3' }}>
                "¿Cómo están estructurando la comisión de su primer SDR en LatAm?"
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>
                Por Mateo Carvajal • 11 aportes de fundadores
              </div>
            </div>

            <div style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-deep)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--gold-400)', fontWeight: 700, marginBottom: '4px' }}>
                #CasosDeÉxito • Victoria de la semana
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF', lineHeight: '1.3' }}>
                "Redujimos el ciclo de ventas de 65 a 28 días aplicando el One-Pager"
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>
                Por Valeria Gómez (COO) • 19 comentarios
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
