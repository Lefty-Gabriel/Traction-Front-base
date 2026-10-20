import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, CheckCircle2, ChevronLeft, ChevronRight, 
  Download, FileSpreadsheet, FileText, BookOpen, Clock, 
  Check, ArrowLeft, Maximize2, Volume2, Sparkles, Share2, 
  ChevronDown, ChevronUp, Edit3 
} from 'lucide-react';

export function CoursePlayerView({ 
  course, 
  initialLessonId, 
  onBack, 
  onToggleLessonCompletion 
}) {
  // Find initial lesson or default to first
  const allLessons = course.modules.flatMap(m => m.lessons);
  const [currentLessonId, setCurrentLessonId] = useState(
    initialLessonId || (allLessons[0] ? allLessons[0].id : null)
  );

  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'resources' | 'notes'
  const [userNote, setUserNote] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [openModules, setOpenModules] = useState({
    [course.modules[0]?.id]: true,
    [course.modules[1]?.id]: true,
    [course.modules[2]?.id]: true,
    [course.modules[3]?.id]: true
  });

  // Current lesson object
  const currentLesson = allLessons.find(l => l.id === currentLessonId) || allLessons[0];
  const currentModule = course.modules.find(m => m.lessons.some(l => l.id === currentLessonId));

  // Load saved note from localStorage for current lesson
  useEffect(() => {
    if (currentLesson) {
      const saved = localStorage.getItem(`traction_note_${currentLesson.id}`);
      setUserNote(saved || '');
    }
  }, [currentLessonId]);

  const handleSaveNote = (text) => {
    setUserNote(text);
    if (currentLesson) {
      localStorage.setItem(`traction_note_${currentLesson.id}`, text);
    }
  };

  const handleToggleModule = (modId) => {
    setOpenModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  // Find index of current lesson in flattened array
  const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleMarkCompletedAndNext = () => {
    if (!currentLesson.completed) {
      onToggleLessonCompletion(course.id, currentLesson.id);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    if (nextLesson) {
      setCurrentLessonId(nextLesson.id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Breadcrumb & Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onBack}
            style={{ padding: '8px 12px' }}
          >
            <ArrowLeft size={16} />
            <span>Volver a Cursos</span>
          </button>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--emerald-400)', fontWeight: 700, textTransform: 'uppercase' }}>
              {course.category} • {currentModule?.title.split(':')[0]}
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
              {course.title}
            </h1>
          </div>
        </div>

        {/* Course Global Progress Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Progreso del Programa</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--emerald-400)' }}>
              {course.progressPercent}% Completado
            </div>
          </div>
          <div style={{ width: '100px' }}>
            <div className="progress-bar-container" style={{ height: '6px' }}>
              <div className="progress-bar-fill" style={{ width: `${course.progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Cinema Player + Modular Course Sidebar */}
      <div className="player-container">
        {/* Lado Izquierdo: Reproductor de Video y Contenido de la Lección */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
          {/* Pantalla de Video */}
          <div className="video-screen-wrapper">
            <video 
              key={currentLesson?.videoUrl}
              src={currentLesson?.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
              controls
              autoPlay
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              playbackRate={playbackSpeed}
            />

            {/* Banner de Celebración si se marca completada */}
            {showCelebration && (
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'var(--brand-celeste)',
                color: '#000000',
                padding: '10px 18px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 800,
                fontSize: '13px',
                boxShadow: 'var(--shadow-lg)',
                animation: 'fadeIn 0.3s ease-out'
              }}>
                <Sparkles size={16} />
                <span>¡Lección completada! Progreso actualizado</span>
              </div>
            )}
          </div>

          {/* Barra de Controles y Avance de la Lección */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                className={`btn btn-sm ${currentLesson?.completed ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleMarkCompletedAndNext}
                style={{ padding: '8px 16px' }}
              >
                <CheckCircle2 size={16} />
                <span>
                  {currentLesson?.completed ? 'Completada (Ir a Siguiente)' : 'Marcar como Completada'}
                </span>
              </button>

              {/* Selector de Velocidad */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-deep)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>Velocidad:</span>
                {[1, 1.25, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    style={{
                      background: playbackSpeed === spd ? 'var(--brand-celeste)' : 'transparent',
                      color: playbackSpeed === spd ? '#000000' : 'var(--text-muted)',
                      border: 'none',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Botones de Navegación Anterior / Siguiente */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                className="btn btn-secondary btn-sm"
                disabled={!prevLesson}
                onClick={() => prevLesson && setCurrentLessonId(prevLesson.id)}
                style={{ opacity: prevLesson ? 1 : 0.4, cursor: prevLesson ? 'pointer' : 'not-allowed' }}
              >
                <ChevronLeft size={16} />
                <span>Anterior</span>
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                disabled={!nextLesson}
                onClick={() => nextLesson && setCurrentLessonId(nextLesson.id)}
                style={{ opacity: nextLesson ? 1 : 0.4, cursor: nextLesson ? 'pointer' : 'not-allowed' }}
              >
                <span>Siguiente</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Información y Pestañas de la Lección */}
          <div className="card">
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              {currentLesson?.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              <span><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> {currentLesson?.duration}</span>
              <span>•</span>
              <span>Instructor: <strong style={{ color: 'var(--text-main)' }}>{course.mentorName}</strong></span>
            </div>

            {/* Pestañas */}
            <div className="tabs-nav">
              <button 
                className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
                onClick={() => setActiveTab('summary')}
              >
                Resumen Ejecutivo
              </button>
              <button 
                className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
                onClick={() => setActiveTab('resources')}
              >
                Recursos ({currentLesson?.resources?.length || 0})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                Mis Notas del Alumno
              </button>
            </div>

            {/* Contenido de Pestaña: Resumen */}
            {activeTab === 'summary' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Objetivo de la sesión
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                    {currentLesson?.summary}
                  </p>
                </div>

                {currentLesson?.notes && (
                  <div style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(6, 171, 235, 0.08)',
                    border: '1px solid rgba(6, 171, 235, 0.3)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-celeste)', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
                      <Sparkles size={16} />
                      <span>Insight Estratégico de Tracción</span>
                    </div>
                    <p style={{ color: '#E2E8F0', fontSize: '13px', lineHeight: '1.5' }}>
                      {currentLesson.notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Contenido de Pestaña: Recursos */}
            {activeTab === 'resources' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentLesson?.resources && currentLesson.resources.length > 0 ? (
                  currentLesson.resources.map((res, idx) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        background: 'var(--bg-deep)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', background: 'rgba(6, 171, 235, 0.12)', color: 'var(--brand-celeste)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {res.type === 'excel' ? <FileSpreadsheet size={20} /> : <FileText size={20} />}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{res.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{res.size} • Material oficial Traction</div>
                        </div>
                      </div>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => alert(`Descargando material: ${res.title}`)}
                      >
                        <Download size={14} />
                        <span>Descargar</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
                    Esta lección está enfocada en la conceptualización estratégica. No requiere archivos descargables.
                  </div>
                )}
              </div>
            )}

            {/* Contenido de Pestaña: Notas del Alumno con Auto-Guardado */}
            {activeTab === 'notes' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Tus notas se guardan de forma privada y automática para esta lección.
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--emerald-400)', fontWeight: 600 }}>
                    <Check size={12} style={{ display: 'inline', marginRight: '4px' }} /> Auto-guardado activo
                  </span>
                </div>
                <textarea 
                  value={userNote}
                  onChange={(e) => handleSaveNote(e.target.value)}
                  placeholder="Escribe tus notas ejecutivas, aprendizajes clave y aplicaciones directas para tu empresa..."
                  rows={6}
                  style={{
                    width: '100%',
                    background: 'var(--bg-deep)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    color: 'var(--text-main)',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Lado Derecho: Sidebar Modular de Cursos y Lecciones */}
        <div className="modules-sidebar">
          {/* Header del Sidebar Modular */}
          <div style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-elevated)'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
              Contenido del Programa
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {allLessons.filter(l => l.completed).length} de {allLessons.length} lecciones completadas
            </p>
          </div>

          {/* Lista de Módulos y Lecciones */}
          <div className="modules-list">
            {course.modules.map((mod, modIdx) => {
              const isOpen = openModules[mod.id] ?? true;
              const moduleLessonsCompleted = mod.lessons.filter(l => l.completed).length;

              return (
                <div key={mod.id} className="module-group">
                  <div 
                    className="module-header"
                    onClick={() => handleToggleModule(mod.id)}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {mod.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                        {moduleLessonsCompleted}/{mod.lessons.length} completadas
                      </div>
                    </div>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>

                  {/* Lecciones dentro del Módulo */}
                  {isOpen && (
                    <div>
                      {mod.lessons.map((lesson) => {
                        const isCurrent = lesson.id === currentLessonId;

                        return (
                          <div 
                            key={lesson.id}
                            className={`lesson-row ${isCurrent ? 'active' : ''}`}
                            onClick={() => setCurrentLessonId(lesson.id)}
                          >
                            <button
                              className={`lesson-check ${lesson.completed ? 'completed' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleLessonCompletion(course.id, lesson.id);
                              }}
                              title={lesson.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                            >
                              {lesson.completed && <Check size={12} strokeWidth={3} />}
                            </button>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="lesson-title" style={{ fontSize: '12px', color: isCurrent ? 'var(--brand-celeste)' : 'var(--text-muted)', lineHeight: '1.4' }}>
                                {lesson.title}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                                {lesson.duration}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
