import React, { useState } from 'react';
import { Film, Play, Search, Clock, Users, ArrowLeft, Eye, Download, Sparkles } from 'lucide-react';

export function ReplaysView({ replays, onNavigate }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeReplayModal, setActiveReplayModal] = useState(null);

  const categories = ['all', 'Ventas B2B', 'Finanzas', 'Growth & Producto', 'Liderazgo'];

  const filteredReplays = replays.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                          r.mentor.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-amber">
              <Film size={14} />
              <span>Videoteca Bajo Demanda</span>
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>
            Grabaciones de Clases en Vivo (Replays)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Accede a todas las sesiones y talleres anteriores. Nunca te perderás una clase de alto valor.
          </p>
        </div>

        {/* Buscador de Replays */}
        <div style={{ width: '280px' }}>
          <input 
            type="text"
            placeholder="Buscar por tema o mentor..."
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
              border: selectedCategory === cat ? '1px solid var(--gold-400)' : '1px solid var(--border-subtle)',
              background: selectedCategory === cat ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface)',
              color: selectedCategory === cat ? 'var(--gold-300)' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {cat === 'all' ? 'Todas las Categorías' : cat}
          </button>
        ))}
      </div>

      {/* Grid de Replays */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredReplays.map((replay) => (
          <div 
            key={replay.id}
            className="card card-interactive"
            onClick={() => setActiveReplayModal(replay)}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {/* Thumbnail con botón Play superpuesto */}
            <div style={{
              position: 'relative',
              height: '180px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: '16px'
            }}>
              <img 
                src={replay.thumbnail} 
                alt={replay.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(9, 13, 22, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.9)',
                  color: '#1E1000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--glow-gold)'
                }}>
                  <Play size={22} fill="currentColor" style={{ marginLeft: '3px' }} />
                </div>
              </div>

              {/* Badges de duración y fecha */}
              <span className="badge badge-amber" style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '11px' }}>
                {replay.category}
              </span>
              <span style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(0, 0, 0, 0.8)',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#FFF'
              }}>
                {replay.duration}
              </span>
            </div>

            {/* Contenido */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px' }}>
                Grabado el {replay.date} • <Eye size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {replay.views} vistas
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px', lineHeight: '1.3' }}>
                {replay.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '16px' }}>
                {replay.description}
              </p>

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: 600 }}>
                  Mentor: {replay.mentor}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--gold-400)', fontWeight: 700 }}>
                  Ver Grabación →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Reproducción del Replay */}
      {activeReplayModal && (
        <div className="modal-backdrop" onClick={() => setActiveReplayModal(null)}>
          <div 
            className="modal-dialog" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '860px', overflow: 'hidden' }}
          >
            <div style={{
              padding: '16px 24px',
              background: 'var(--bg-deep)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span className="badge badge-amber" style={{ marginBottom: '4px' }}>Replay Grabado</span>
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>{activeReplayModal.title}</h3>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Mentor: {activeReplayModal.mentor} • Duración: {activeReplayModal.duration}
                </div>
              </div>
              <button 
                onClick={() => setActiveReplayModal(null)}
                className="btn btn-secondary btn-sm"
              >
                Cerrar
              </button>
            </div>

            <div style={{ aspectRatio: '16/9', background: '#000' }}>
              <video 
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
                controls
                autoPlay
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '500px' }}>
                {activeReplayModal.description}
              </p>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => alert('Descargando diapositivas de la sesión grabada...')}
              >
                <Download size={14} />
                <span>Descargar Diapositivas</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
