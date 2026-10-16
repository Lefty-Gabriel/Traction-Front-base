import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, MessageCircle, Pin, Plus, Share2, Sparkles, Send } from 'lucide-react';

export function CommunityView({ threads, user }) {
  const [threadList, setThreadList] = useState(threads);
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Ventas B2B');

  const channels = ['all', 'Ventas B2B', 'Finanzas', 'Casos de Éxito', 'Liderazgo'];

  const handleLike = (id) => {
    setThreadList(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, likes: t.likes + 1, likedByMe: true };
      }
      return t;
    }));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost = {
      id: `th_${Date.now()}`,
      author: user.name,
      authorRole: user.title,
      authorAvatar: user.avatar,
      badge: user.plan,
      title: newTitle,
      content: newContent,
      category: newCategory,
      likes: 1,
      commentsCount: 0,
      timeAgo: 'Hace un momento',
      isPinned: false
    };

    setThreadList([newPost, ...threadList]);
    setNewTitle('');
    setNewContent('');
    setShowNewPostModal(false);
  };

  const filteredThreads = selectedChannel === 'all'
    ? threadList
    : threadList.filter(t => t.category === selectedChannel);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-emerald">
              <MessageSquare size={14} />
              <span>Red Privada de Empresarios</span>
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>
            Comunidad & Mesa Redonda de Tracción
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Resuelve cuellos de botella con fundadores que enfrentan los mismos retos comerciales y operativos.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowNewPostModal(true)}
          style={{ gap: '8px' }}
        >
          <Plus size={16} />
          <span>Iniciar Nuevo Debate</span>
        </button>
      </div>

      {/* Selector de Canales */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {channels.map((ch) => (
          <button
            key={ch}
            onClick={() => setSelectedChannel(ch)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: selectedChannel === ch ? '1px solid var(--emerald-500)' : '1px solid var(--border-subtle)',
              background: selectedChannel === ch ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
              color: selectedChannel === ch ? 'var(--emerald-400)' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {ch === 'all' ? 'Todos los Debates' : `#${ch}`}
          </button>
        ))}
      </div>

      {/* Lista de Hilos de Discusión */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredThreads.map((thread) => (
          <div 
            key={thread.id}
            className="card"
            style={{ padding: '22px 24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={thread.authorAvatar} 
                  alt={thread.author} 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>{thread.author}</span>
                    <span className="badge badge-emerald" style={{ fontSize: '10px', padding: '2px 6px' }}>
                      {thread.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    {thread.authorRole} • {thread.timeAgo}
                  </div>
                </div>
              </div>

              {thread.isPinned && (
                <span className="badge badge-amber" style={{ fontSize: '11px' }}>
                  <Pin size={11} /> Destacado
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px', lineHeight: '1.4' }}>
              {thread.title}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              {thread.content}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className={`btn btn-sm ${thread.likedByMe ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleLike(thread.id)}
                  style={{ gap: '6px' }}
                >
                  <ThumbsUp size={14} />
                  <span>{thread.likes} Votos</span>
                </button>

                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => alert(`Abriendo hilo de discusión: "${thread.title}"...`)}
                  style={{ gap: '6px' }}
                >
                  <MessageCircle size={14} />
                  <span>{thread.commentsCount} Respuestas</span>
                </button>
              </div>

              <span style={{ fontSize: '12px', color: 'var(--emerald-400)', fontWeight: 600 }}>
                #{thread.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Crear Nuevo Post */}
      {showNewPostModal && (
        <div className="modal-backdrop" onClick={() => setShowNewPostModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Iniciar Nueva Discusión Empresarial</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Comparte una duda sobre tu proceso o un caso de éxito con los demás miembros.</p>
            </div>

            <form onSubmit={handleCreatePost} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Canal / Temática
                </label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-deep)',
                    border: '1px solid var(--border-medium)',
                    color: '#FFF',
                    fontSize: '13px'
                  }}
                >
                  <option value="Ventas B2B">Ventas B2B & Prospección</option>
                  <option value="Finanzas">Finanzas & Runway</option>
                  <option value="Casos de Éxito">Casos de Éxito & Victorias</option>
                  <option value="Liderazgo">Liderazgo & Equipos</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Título de la consulta o aporte
                </label>
                <input 
                  type="text" 
                  placeholder="Ej: ¿Qué CRM recomiendan para un equipo de 3 vendedores?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-deep)',
                    border: '1px solid var(--border-medium)',
                    color: '#FFF',
                    fontSize: '13px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Detalles y contexto de tu empresa
                </label>
                <textarea 
                  rows={4}
                  placeholder="Describe la situación actual, qué has intentado y qué sugerencias buscas..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-deep)',
                    border: '1px solid var(--border-medium)',
                    color: '#FFF',
                    fontSize: '13px',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowNewPostModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Send size={14} />
                  <span>Publicar Debate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
