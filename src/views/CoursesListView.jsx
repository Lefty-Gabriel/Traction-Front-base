import React, { useState } from 'react';
import { BookOpen, Search, Play, Clock, Star, Users, CheckCircle2, Award, ChevronRight } from 'lucide-react';

export function CoursesListView({ courses, onSelectCourse }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Ventas Estratégicas', 'Finanzas & Estrategia', 'Crecimiento & Producto', 'Liderazgo & Equipos'];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.tagline.toLowerCase().includes(search.toLowerCase()) ||
                          c.mentorName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-emerald">
              <BookOpen size={14} />
              <span>Programas Curriculares</span>
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>
            Catálogo de Programas de Negocio
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Especializaciones estructuradas paso a paso con video, ejercicios prácticos y plantillas operativas.
          </p>
        </div>

        {/* Buscador */}
        <div style={{ width: '300px' }}>
          <input 
            type="text"
            placeholder="Buscar por programa o mentor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: '#FFF',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Categorías */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: selectedCategory === cat ? '1px solid var(--emerald-500)' : '1px solid var(--border-subtle)',
              background: selectedCategory === cat ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
              color: selectedCategory === cat ? 'var(--emerald-400)' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {cat === 'all' ? 'Todos los Programas' : cat}
          </button>
        ))}
      </div>

      {/* Grid de Cursos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {filteredCourses.map((course) => (
          <div 
            key={course.id}
            className="card card-interactive"
            onClick={() => onSelectCourse(course)}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {/* Thumbnail */}
            <div style={{
              position: 'relative',
              height: '190px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: '16px'
            }}>
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(9, 13, 22, 0.9) 0%, transparent 60%)'
              }} />

              <span className="badge badge-emerald" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                {course.category}
              </span>

              <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#FFF', fontWeight: 600 }}>
                  <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {course.estimatedHours}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--gold-300)', fontWeight: 700 }}>
                  ★ {course.rating}
                </span>
              </div>
            </div>

            {/* Contenido */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--emerald-400)', fontWeight: 700, marginBottom: '4px' }}>
                Nivel {course.level}
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', lineHeight: '1.3' }}>
                {course.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                {course.tagline}
              </p>

              {/* Mentor */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto', marginBottom: '16px' }}>
                <img 
                  src={course.mentorAvatar} 
                  alt={course.mentorName} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-medium)' }}
                />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>{course.mentorName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{course.mentorRole}</div>
                </div>
              </div>

              {/* Barra de Progreso y Botón */}
              <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: '130px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Progreso</span>
                    <span style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>{course.progressPercent}%</span>
                  </div>
                  <div className="progress-bar-container" style={{ height: '6px' }}>
                    <div className="progress-bar-fill" style={{ width: `${course.progressPercent}%` }} />
                  </div>
                </div>

                <button 
                  className="btn btn-primary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCourse(course);
                  }}
                  style={{ gap: '6px' }}
                >
                  <Play size={13} fill="currentColor" />
                  <span>{course.progressPercent > 0 ? 'Continuar' : 'Empezar'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
