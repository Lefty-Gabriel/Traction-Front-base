const courseImages = [
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80',
];

const avatar = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80';

export function roleToFrontend(role) {
  if (role === 'docente') return 'mentor';
  if (role === 'alumno' || role === 'estudiante') return 'student';
  return role;
}

export function adaptUser(user) {
  const role = roleToFrontend(user.role);
  return {
    ...user,
    role,
    name: user.fullName || user.email,
    title: user.title || (role === 'admin' ? 'Administrador del Sistema' : role === 'mentor' ? 'Mentor' : 'Miembro de la Comunidad'),
    avatar: user.avatarUrl || avatar,
    plan: role === 'admin' ? 'Administrador' : role === 'mentor' ? 'Mentor Oficial' : 'Miembro activo',
    planTier: role,
    stats: role === 'admin'
      ? { totalStudents: 0, mrr: '—', totalCourses: 0, activeLiveSessions: 0 }
      : role === 'mentor'
        ? { assignedCourses: 0, upcomingLiveClasses: 0, activeStudents: 0, averageRating: '—', questionsPending: 0 }
        : { coursesInProgress: 0, completedLessons: 0, totalHoursWatched: 0, certificationsEarned: 0, attendanceRate: '—' },
  };
}

export function adaptCourse(course, index = 0) {
  return {
    ...course,
    tagline: course.description || 'Programa de formación de Comunidad del Intercambio.',
    category: 'Formación empresarial',
    level: 'Profesional',
    mentorName: course.docenteId ? 'Mentor asignado' : 'Por asignar',
    mentorRole: 'Mentor Oficial',
    mentorAvatar: avatar,
    thumbnail: courseImages[index % courseImages.length],
    progressPercent: 0,
    completedLessonsCount: 0,
    totalLessonsCount: 0,
    estimatedHours: 'Contenido en preparación',
    isEnrolled: true,
    rating: '—',
    modules: [],
  };
}

export function adaptLiveSession(session, courses = []) {
  const scheduled = new Date(session.scheduledAt || session.createdAt);
  const durationMinutes = session.durationMinutes || 60;
  const end = new Date(scheduled.getTime() + durationMinutes * 60 * 1000);
  const now = new Date();
  const isWithinSchedule = now >= scheduled && now < end;
  const isEndedByTime = now >= end;
  const course = courses.find((item) => String(item.id) === String(session.courseId));
  const effectiveStatus = session.status === 'ended' || isEndedByTime
    ? 'ended'
    : session.status === 'live' || isWithinSchedule
      ? 'live'
      : 'scheduled';
  return {
    ...session,
    subtitle: course ? `Sesión de ${course.title}` : 'Sesión de formación en vivo',
    mentorName: session.startedBy ? 'Mentor del curso' : 'Por confirmar',
    mentorAvatar: avatar,
    date: Number.isNaN(scheduled.getTime()) ? 'Fecha por confirmar' : scheduled.toLocaleDateString('es-EC', { dateStyle: 'medium' }),
    time: Number.isNaN(scheduled.getTime()) ? '' : scheduled.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
    duration: `${durationMinutes} min`,
    isToday: scheduled.toDateString() === now.toDateString(),
    isLiveNow: effectiveStatus === 'live',
    attendeesCount: 0,
    category: 'Formación empresarial',
    badge: effectiveStatus === 'live' ? 'En vivo ahora' : effectiveStatus === 'ended' ? 'Finalizada' : 'Programada',
    effectiveStatus,
    deliverables: [],
  };
}

export function adaptVideo(video) {
  const created = new Date(video.createdAt);
  return {
    ...video,
    thumbnail: courseImages[0],
    category: video.status === 'ready' ? 'Disponible' : 'Procesando',
    mentor: 'Comunidad del Intercambio',
    date: Number.isNaN(created.getTime()) ? '—' : created.toLocaleDateString('es-EC'),
    views: '—',
    duration: video.durationSeconds ? `${Math.ceil(video.durationSeconds / 60)} min` : 'Duración pendiente',
  };
}
