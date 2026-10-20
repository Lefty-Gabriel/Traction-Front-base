import React, { useState } from 'react';
import { 
  Users, Radio, BookOpen, Clock, Star, MessageSquare, 
  Send, CheckCircle2, ChevronRight, Download, Sparkles, 
  Award, Play, HelpCircle 
} from 'lucide-react';
import { mentorQuestions as initialQuestions } from '../data/mockData';

export function MentorDashboardView({ 
  user, 
  liveClasses, 
  courses, 
  onOpenLiveSession, 
  onNavigate 
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const featuredLive = liveClasses[0];

  const handleSendReply = (questionId) => {
    if (!replyText.trim()) return;
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          status: 'Respondida',
          mentorReply: replyText,
          repliedAt: 'Hace unos momentos'
        };
      }
      return q;
    }));
    setReplyingTo(null);
    setReplyText('');
  };

  const pendingQuestionsCount = questions.filter(q => q.status === 'Pendiente').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Saludo y Métricas del Mentor */}
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
              <span>Red de Mentores de Élite</span>
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Mentor Oficial • {user.company || 'ScaleB2B Ventures'}
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            Panel del Mentor: {user.name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '4px' }}>
            Gestiona tus programas, modera las preguntas de tus alumnos y dirige tus sesiones en vivo.
          </p>
        </div>

        {/* Tarjetas de Métricas de Mentoría */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Users size={20} />
            </div>
            <div>
              <div className="stat-value">348</div>
              <div className="stat-label">Alumnos Activos</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--bg-surface-elevated)', color: 'var(--brand-celeste)', borderColor: 'var(--border-subtle)' }}>
              <Star size={20} />
            </div>
            <div>
              <div className="stat-value">4.95 ★</div>
              <div className="stat-label">Calificación Promedio</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <HelpCircle size={20} />
            </div>
            <div>
              <div className="stat-value">{pendingQuestionsCount}</div>
              <div className="stat-label">Dudas por Responder</div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner de Próxima Clase a Impartir (Host) */}
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
                  <span>TU SESIÓN EN VIVO DE HOY</span>
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {featuredLive.time} • Sala Oficial
                </span>
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1.3' }}>
                {featuredLive.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px', lineHeight: '1.5' }}>
                {featuredLive.subtitle}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 600 }}>
                  <Users size={15} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle', color: 'var(--brand-celeste)' }} />
                  142 alumnos confirmados en lista
                </div>
                <div style={{ height: '20px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Duración: <strong>{featuredLive.duration}</strong>
                </div>
              </div>
            </div>

            {/* Controles de Sala para el Mentor */}
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand-celeste)', fontWeight: 700 }}>
                Control de Host Mentor
              </span>

              <button 
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px 20px', fontSize: '14px' }}
                onClick={() => onOpenLiveSession(featuredLive)}
              >
                <Radio size={16} />
                <span>Abrir Sala de Clase (Iniciar Host)</span>
              </button>

              <a 
                href={featuredLive.joinUrl} 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                Probar Enlace de Zoom
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Preguntas de Alumnos por Resolver & Programas a su Cargo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Preguntas de Alumnos (Q&A de Lecciones) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} style={{ color: 'var(--brand-celeste)' }} />
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>
                Dudas y Consultas de Alumnos
              </h3>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '11px' }}>
              {pendingQuestionsCount} pendientes
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {questions.map((q) => (
              <div 
                key={q.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                      src={q.studentAvatar} 
                      alt={q.studentName} 
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{q.studentName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{q.studentCompany} • {q.timeAgo}</div>
                    </div>
                  </div>

                  <span className={q.status === 'Pendiente' ? 'badge badge-amber' : 'badge badge-emerald'} style={{ fontSize: '10px' }}>
                    {q.status}
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--brand-celeste)', fontWeight: 600 }}>
                  {q.courseTitle} • {q.lessonTitle}
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  "{q.question}"
                </p>

                {q.mentorReply && (
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--brand-celeste-subtle)',
                    border: '1px solid var(--brand-celeste-border)',
                    fontSize: '12px'
                  }}>
                    <strong style={{ color: 'var(--brand-celeste)' }}>Tu respuesta: </strong>
                    <span style={{ color: 'var(--text-main)' }}>{q.mentorReply}</span>
                  </div>
                )}

                {replyingTo === q.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    <textarea 
                      rows={3}
                      placeholder="Escribe tu recomendación ejecutiva para el alumno..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-medium)',
                        color: 'var(--text-main)',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                      >
                        Cancelar
                      </button>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSendReply(q.id)}
                      >
                        <Send size={13} />
                        <span>Enviar Respuesta</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  q.status === 'Pendiente' && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ alignSelf: 'flex-start', marginTop: '4px' }}
                      onClick={() => setReplyingTo(q.id)}
                    >
                      <MessageSquare size={13} />
                      <span>Responder al Alumno</span>
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cursos a Cargo del Mentor */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} style={{ color: 'var(--brand-celeste)' }} />
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>
                Mis Programas Asignados
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
              2 Cursos
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {courses.slice(0, 2).map((course) => (
              <div 
                key={course.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center'
                }}
              >
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  style={{ width: '80px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} 
                />
                <div style={{ flex: 1 }}>
                  <span className="badge badge-emerald" style={{ fontSize: '10px', marginBottom: '4px' }}>
                    {course.category}
                  </span>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {course.title}
                  </h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {course.modules.length} Módulos • ★ {course.rating} de valoración
                  </div>
                </div>
              </div>
            ))}

            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--brand-celeste-subtle)',
              border: '1px solid var(--brand-celeste-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--brand-celeste)' }}>
                ¿Deseas proponer un nuevo taller o masterclass?
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Comunícate con Dirección Académica Traction para añadir una nueva sesión curricular a la agenda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentorDashboardView;
