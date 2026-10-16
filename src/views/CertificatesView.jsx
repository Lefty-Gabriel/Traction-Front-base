import React from 'react';
import { Award, Download, Share2, ShieldCheck, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';

export function CertificatesView({ user }) {
  const certificateData = {
    id: "TRX-CERT-2026-8941",
    courseTitle: "Especialización en Machine de Ventas B2B & Prospección Outbound",
    issueDate: "14 de Septiembre, 2026",
    recipient: user.name,
    company: "ScaleTech",
    hours: "18 Horas Académicas y Prácticas",
    grade: "Distinción de Honor",
    director: "Dirección Académica Traction",
    mentor: "Sofía Valenzuela"
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-amber">
            <Award size={14} />
            <span>Acreditaciones Oficiales</span>
          </span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>
          Certificaciones & Diplomas Ejecutivos
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
          Acreditaciones verificables mediante blockchain y código QR que respaldan tus competencias ante inversionistas y juntas directivas.
        </p>
      </div>

      {/* Diploma Ejecutivo en Formato Grande */}
      <div style={{
        background: 'linear-gradient(145deg, #0D131F, #090D16)',
        border: '2px solid rgba(245, 158, 11, 0.4)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), var(--glow-gold)',
        borderRadius: 'var(--radius-lg)',
        padding: '48px 40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Adorno de fondo de agua */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Encabezado del Certificado */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(245, 158, 11, 0.12)',
            padding: '8px 20px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            marginBottom: '16px'
          }}>
            <ShieldCheck size={18} style={{ color: 'var(--gold-400)' }} />
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--gold-300)', textTransform: 'uppercase' }}>
              TRACTION ESCUELA DE NEGOCIOS
            </span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 400, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Por cuanto se certifica que
          </h2>

          <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', margin: '12px 0 6px', letterSpacing: '-0.01em' }}>
            {certificateData.recipient}
          </div>

          <div style={{ fontSize: '14px', color: 'var(--emerald-400)', fontWeight: 600 }}>
            {certificateData.company}
          </div>
        </div>

        {/* Cuerpo del Diploma */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 36px' }}>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Ha completado satisfactoriamente los requisitos curriculares, evaluaciones prácticas y defensa de modelo comercial del programa:
          </p>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gold-300)', marginTop: '12px', lineHeight: '1.4' }}>
            {certificateData.courseTitle}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px' }}>
            {certificateData.hours} • Calificación: {certificateData.grade}
          </div>
        </div>

        {/* Firmas y Sello de Validación */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingTop: '30px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>{certificateData.mentor}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Mentor Líder del Programa</div>
          </div>

          {/* Sello Dorado Central */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B, #B45309)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1E1000',
              boxShadow: 'var(--glow-gold)',
              margin: '0 auto 6px'
            }}>
              <Award size={32} />
            </div>
            <div style={{ fontSize: '10px', color: 'var(--gold-400)', fontWeight: 800, letterSpacing: '0.1em' }}>
              SELLO DE EXCELENCIA
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID de Verificación Oficial:</div>
            <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--emerald-400)', fontWeight: 700 }}>
              {certificateData.id}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{certificateData.issueDate}</div>
          </div>
        </div>
      </div>

      {/* Botones de Exportación */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button 
          className="btn btn-primary"
          onClick={() => alert(`Generando e imprimiendo certificado PDF oficial (${certificateData.id})...`)}
          style={{ gap: '8px' }}
        >
          <Download size={16} />
          <span>Descargar Diploma Oficial (PDF Alta Resolución)</span>
        </button>

        <button 
          className="btn btn-secondary"
          onClick={() => alert('Generando enlace para añadir insignia a tu perfil de LinkedIn...')}
          style={{ gap: '8px' }}
        >
          <Share2 size={16} />
          <span>Añadir a LinkedIn Profile</span>
        </button>
      </div>
    </div>
  );
}
