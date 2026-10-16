import React, { useState } from 'react';
import { 
  X, Radio, Users, MessageSquare, Hand, Download, 
  ExternalLink, Mic, Video as VideoIcon, Send, Sparkles 
} from 'lucide-react';

export function LiveSessionModal({ 
  isOpen, 
  onClose, 
  liveClass 
}) {
  if (!isOpen || !liveClass) return null;

  const [handRaised, setHandRaised] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, user: 'Mateo C.', time: '18:31', text: '¡Excelente ver a todos! Preparado con mi pipeline de 12 cuentas.' },
    { id: 2, user: 'Valeria G.', time: '18:32', text: 'Sofía, ¿vamos a ver cómo estructurar el follow-up por WhatsApp también?' },
    { id: 3, user: 'Sofía Valenzuela (Mentor)', time: '18:33', isMentor: true, text: '¡Bienvenidos! Sí Valeria, al final dedicaremos 20 min a cadencias de WhatsApp B2B.' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        user: 'Alejandro Morales (Tú)',
        time: 'Ahora',
        text: inputText
      }
    ]);
    setInputText('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-dialog" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '1100px', width: '95vw', height: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        {/* Header de la Sala en Vivo */}
        <div style={{
          padding: '16px 24px',
          background: 'var(--bg-deep)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span className="badge badge-live" style={{ padding: '4px 10px' }}>
              <Radio size={14} />
              <span>SALA EN VIVO ACTIVA</span>
            </span>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>{liveClass.title}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Mentor: <strong style={{ color: 'var(--text-main)' }}>{liveClass.mentorName}</strong> • {liveClass.duration}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a 
              href={liveClass.joinUrl} 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ gap: '6px' }}
            >
              <span>Abrir en Zoom Oficial</span>
              <ExternalLink size={13} />
            </a>
            <button 
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Contenido Principal: Grid Video + Chat */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 340px', minHeight: 0 }}>
          {/* Lado Izquierdo: Transmisión en Vivo */}
          <div style={{ background: '#030508', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Video en vivo con poster de alta calidad */}
              <video 
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
                controls
                autoPlay
                muted
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              
              {/* Badge superpuesto en el video */}
              <div style={{
                position: 'absolute',
                top: '18px',
                left: '18px',
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFF' }}>142 Asistentes Conectados</span>
              </div>
            </div>

            {/* Barra de Controles de Sala */}
            <div style={{
              padding: '14px 20px',
              background: 'var(--bg-surface)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  className={`btn btn-sm ${handRaised ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setHandRaised(!handRaised)}
                >
                  <Hand size={15} />
                  <span>{handRaised ? 'Mano Levantada (En cola)' : 'Levantar la Mano'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {liveClass.deliverables?.map((item, idx) => (
                  <button 
                    key={idx}
                    className="btn btn-secondary btn-sm"
                    title={`Descargar ${item.name}`}
                    onClick={() => alert(`Descargando material: ${item.name}`)}
                  >
                    <Download size={14} />
                    <span>{item.name.split('(')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lado Derecho: Chat en Vivo con Alumnos & Mentores */}
          <div style={{
            background: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <MessageSquare size={16} style={{ color: 'var(--emerald-400)' }} />
              <span style={{ fontWeight: 700, fontSize: '13px' }}>Chat en Vivo con Alumnos</span>
            </div>

            {/* Mensajes del chat */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((m) => (
                <div key={m.id} style={{
                  background: m.isMentor ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-deep)',
                  border: m.isMentor ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: m.isMentor ? 'var(--emerald-400)' : 'var(--text-main)'
                    }}>
                      {m.user}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{m.time}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {m.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Input de envío de chat */}
            <form onSubmit={handleSendMessage} style={{
              padding: '12px 14px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '8px',
              background: 'var(--bg-deep)'
            }}>
              <input 
                type="text" 
                placeholder="Escribe una pregunta para la clase..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  color: '#FFF',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 12px' }}>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
