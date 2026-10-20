import React, { useState, useEffect } from 'react';
import { 
  replays as initialReplays, 
  libraryResources as initialResources, 
  mentors as initialMentors, 
  notificationsList as initialNotifications, 
  membershipPlans, 
  communityThreads 
} from './data/mockData';
import { api, clearSession, hasSession, saveSession } from './services/api';
import { adaptCourse, adaptLiveSession, adaptUser, adaptVideo } from './services/adapters';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NotificationsModal } from './components/NotificationsModal';
import { MembershipModal } from './components/MembershipModal';
import { LiveSessionModal } from './components/LiveSessionModal';

import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { MentorDashboardView } from './views/MentorDashboardView';
import { CoursesListView } from './views/CoursesListView';
import { CoursePlayerView } from './views/CoursePlayerView';
import { LiveClassesView } from './views/LiveClassesView';
import { ReplaysView } from './views/ReplaysView';
import { LibraryView } from './views/LibraryView';
import { MentorsView } from './views/MentorsView';
import { CommunityView } from './views/CommunityView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';

const VIEW_PATHS = {
  dashboard: '/panel',
  'mentor-dashboard': '/mentor',
  courses: '/programas',
  live: '/clases-en-vivo',
  replays: '/replays',
  library: '/biblioteca',
  mentors: '/mentores',
  community: '/comunidad',
  profile: '/perfil',
  'admin-overview': '/administrador',
  'admin-courses': '/administrador/cursos',
  'admin-live': '/administrador/sesiones',
  'admin-users': '/administrador/usuarios',
};

const ROLE_VIEWS = {
  student: ['dashboard', 'courses', 'course-player', 'live', 'replays', 'library', 'mentors', 'community', 'profile'],
  mentor: ['mentor-dashboard', 'live', 'replays', 'library', 'community', 'profile'],
  admin: ['admin-overview', 'admin-courses', 'admin-live', 'admin-users', 'profile'],
};

const homeViewForRole = (role) => role === 'admin' ? 'admin-overview' : role === 'mentor' ? 'mentor-dashboard' : 'dashboard';

const viewFromPath = (pathname) => {
  if (/^\/programas\/[^/]+$/.test(pathname)) return 'course-player';
  return Object.entries(VIEW_PATHS).find(([, path]) => path === pathname)?.[0] || null;
};

const pathForView = (view, courseId) => view === 'course-player'
  ? `/programas/${courseId}`
  : VIEW_PATHS[view];

export function App() {
  // Configuración de visualización: Modo Blanco Corporativo
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('traction_theme', 'light');
  }, []);

  // Auth & Multi-Role State
  const [isAuthenticated, setIsAuthenticated] = useState(hasSession);
  const [isBootstrapping, setIsBootstrapping] = useState(hasSession);
  const [appError, setAppError] = useState('');

  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('traction_auth_role') || 'student';
  });

  const [user, setUser] = useState(null);

  // Application Data State
  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [replays, setReplays] = useState(initialReplays);
  const [resources, setResources] = useState(initialResources);
  const [mentors, setMentors] = useState(initialMentors);
  const [notifications, setNotifications] = useState(initialNotifications);

  // Navigation State
  const [currentView, setCurrentView] = useState(() => {
    const routeView = viewFromPath(window.location.pathname);
    if (routeView) return routeView;
    const savedRole = localStorage.getItem('traction_auth_role');
    return homeViewForRole(savedRole);
  });

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  // Modals State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [liveSessionModalData, setLiveSessionModalData] = useState(null);

  // Sidebar Open / Collapsed State ("guardar y abrir / desplazar")
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('traction_sidebar_open');
    if (saved !== null) return saved === 'true';
    return true;
  });

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => {
      const next = !prev;
      localStorage.setItem('traction_sidebar_open', String(next));
      return next;
    });
  };

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  const loadApplicationData = async (profile) => {
    const requests = [api.courses.list(), api.liveSessions.list(), api.videos.list()];
    if (profile.role === 'admin') requests.push(api.users.list());

    const [courseRows, sessionRows, videoRows, userRows = []] = await Promise.all(requests);
    const adaptedCourses = courseRows.map(adaptCourse);
    const adaptedSessions = sessionRows.map((session) => adaptLiveSession(session, adaptedCourses));
    const adaptedUser = adaptUser(profile);
    adaptedUser.stats = {
      ...adaptedUser.stats,
      coursesInProgress: adaptedCourses.length,
      assignedCourses: adaptedCourses.length,
      totalCourses: adaptedCourses.length,
      upcomingLiveClasses: adaptedSessions.filter((item) => item.status !== 'ended').length,
      activeLiveSessions: adaptedSessions.filter((item) => item.status === 'live').length,
      totalStudents: userRows.filter((item) => item.role === 'estudiante' || item.role === 'alumno').length,
    };

    setUser(adaptedUser);
    setCourses(adaptedCourses);
    setLiveClasses(adaptedSessions);
    setReplays(videoRows.map(adaptVideo));
    setUsers(userRows);
    return adaptedUser;
  };

  useEffect(() => {
    if (!hasSession()) return;
    let active = true;
    (async () => {
      try {
        const profile = await api.me();
        if (!active) return;
        const loadedUser = await loadApplicationData(profile);
        if (!active) return;
        const role = loadedUser.role;
        setCurrentRole(role);
        setIsAuthenticated(true);
        localStorage.setItem('traction_authenticated', 'true');
        localStorage.setItem('traction_auth_role', role);
      } catch (error) {
        if (!active) return;
        clearSession();
        setIsAuthenticated(false);
        setAppError(error.message);
      } finally {
        if (active) setIsBootstrapping(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // Mantener la lista administrativa sincronizada con nuevos registros.
  useEffect(() => {
    if (!isAuthenticated || currentRole !== 'admin') return;
    let active = true;

    const refreshUsers = async () => {
      try {
        const latestUsers = await api.users.list();
        if (active) setUsers(latestUsers);
      } catch (error) {
        if (active && error.status !== 401) setAppError(error.message);
      }
    };

    const handleFocus = () => refreshUsers();
    const intervalId = window.setInterval(refreshUsers, 5000);
    window.addEventListener('focus', handleFocus);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated, currentRole]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    const refreshLiveSessions = async () => {
      try {
        const rows = await api.liveSessions.list();
        if (active) setLiveClasses(rows.map((session) => adaptLiveSession(session, courses)));
      } catch (error) {
        if (active && error.status !== 401) setAppError(error.message);
      }
    };
    const intervalId = window.setInterval(refreshLiveSessions, 30000);
    return () => { active = false; window.clearInterval(intervalId); };
  }, [isAuthenticated, currentRole, courses]);

  useEffect(() => {
    if (isBootstrapping) return;
    if (!isAuthenticated) {
      if (window.location.pathname !== '/login') window.history.replaceState({}, '', '/login');
      return;
    }

    const requestedView = viewFromPath(window.location.pathname);
    const allowed = requestedView && ROLE_VIEWS[currentRole]?.includes(requestedView);
    if (!allowed) {
      const homeView = homeViewForRole(currentRole);
      setCurrentView(homeView);
      window.history.replaceState({}, '', pathForView(homeView));
    }
  }, [isAuthenticated, isBootstrapping, currentRole]);

  useEffect(() => {
    const handlePopState = () => {
      if (!isAuthenticated) {
        setCurrentView(homeViewForRole(currentRole));
        return;
      }
      const nextView = viewFromPath(window.location.pathname);
      if (nextView && ROLE_VIEWS[currentRole]?.includes(nextView)) {
        setCurrentView(nextView);
      } else {
        const homeView = homeViewForRole(currentRole);
        setCurrentView(homeView);
        window.history.replaceState({}, '', pathForView(homeView));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated, currentRole]);

  useEffect(() => {
    const match = window.location.pathname.match(/^\/programas\/([^/]+)$/);
    if (!match || !courses.length) return;
    const course = courses.find((item) => String(item.id) === decodeURIComponent(match[1]));
    if (!course) return;
    setSelectedCourse(course);
    const lessons = course.modules?.flatMap((module) => module.lessons) || [];
    setSelectedLessonId((current) => current || lessons.find((lesson) => !lesson.completed)?.id || lessons[0]?.id || null);
  }, [courses]);

  // Handle real API login
  const handleLogin = async ({ email, password }) => {
    const session = await api.login(email, password);
    saveSession(session);
    const accountUser = await loadApplicationData(session.user);
    const role = accountUser.role;
    setAppError('');
    setUser(accountUser);
    setCurrentRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('traction_authenticated', 'true');
    localStorage.setItem('traction_auth_role', role);

    const homeView = homeViewForRole(role);
    setCurrentView(homeView);
    window.history.replaceState({}, '', pathForView(homeView));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegister = async ({ fullName, email, password }) => {
    await api.register(fullName, email, password);
    await handleLogin({ email, password });
  };

  // Handle Logout
  const handleLogout = () => {
    clearSession();
    setIsAuthenticated(false);
    setUser(null);
    setCourses([]);
    setLiveClasses([]);
    setCurrentView('dashboard');
    window.history.replaceState({}, '', '/login');
  };

  // Handle Update User Profile
  const handleUpdateUser = async (updatedData, avatarFile) => {
    const payload = {
      fullName: updatedData.name,
      email: updatedData.email,
      title: updatedData.title,
      company: updatedData.company,
      phone: updatedData.phone,
      location: updatedData.location,
      linkedin: updatedData.linkedin || undefined,
      website: updatedData.website || undefined,
      bio: updatedData.bio,
    };
    if (!avatarFile && updatedData.avatar && !updatedData.avatar.startsWith('data:')) payload.avatarUrl = updatedData.avatar;
    let saved = await api.profile.update(payload);
    if (avatarFile) saved = await api.profile.uploadAvatar(avatarFile);
    const adapted = adaptUser(saved);
    setUser((previous) => ({ ...previous, ...adapted, stats: previous.stats }));
    return adapted;
  };

  // Handle Navigation
  const handleNavigate = (viewId) => {
    if (!ROLE_VIEWS[currentRole]?.includes(viewId)) return;
    setCurrentView(viewId);
    const nextPath = pathForView(viewId, selectedCourse?.id);
    if (nextPath && window.location.pathname !== nextPath) window.history.pushState({}, '', nextPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Course in Player
  const handleSelectCourse = (course) => {
    if (!course.modules?.length) {
      setAppError('Este curso todavía no tiene módulos publicados en el backend.');
      return;
    }
    setSelectedCourse(course);
    // Select first lesson or first uncompleted
    const allLessons = course.modules.flatMap(m => m.lessons);
    const firstUncompleted = allLessons.find(l => !l.completed);
    setSelectedLessonId(firstUncompleted ? firstUncompleted.id : (allLessons[0]?.id || null));
    setCurrentView('course-player');
    window.history.pushState({}, '', pathForView('course-player', course.id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Lesson Completion and Recalculate Course Progress Percentage
  const handleToggleLessonCompletion = (courseId, lessonId) => {
    setCourses(prevCourses => {
      return prevCourses.map(course => {
        if (course.id !== courseId) return course;

        const updatedModules = course.modules.map(mod => {
          const updatedLessons = mod.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              return { ...lesson, completed: !lesson.completed };
            }
            return lesson;
          });
          return { ...mod, lessons: updatedLessons };
        });

        const allLessons = updatedModules.flatMap(m => m.lessons);
        const completedCount = allLessons.filter(l => l.completed).length;
        const totalCount = allLessons.length;
        const newPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return {
          ...course,
          modules: updatedModules,
          completedLessonsCount: completedCount,
          progressPercent: newPercent
        };
      });
    });

    // Also update current active selectedCourse if inside player
    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prev => {
        const updatedModules = prev.modules.map(mod => {
          const updatedLessons = mod.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              return { ...lesson, completed: !lesson.completed };
            }
            return lesson;
          });
          return { ...mod, lessons: updatedLessons };
        });

        const allLessons = updatedModules.flatMap(m => m.lessons);
        const completedCount = allLessons.filter(l => l.completed).length;
        const totalCount = allLessons.length;
        const newPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return {
          ...prev,
          modules: updatedModules,
          completedLessonsCount: completedCount,
          progressPercent: newPercent
        };
      });
    }

    // Update global user stats
    setUser(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        completedLessons: prev.stats.completedLessons + 1
      }
    }));
  };


  // Membership tier change handler
  const handleSelectTier = (tierId, tierName) => {
    setUser(prev => ({
      ...prev,
      plan: tierName,
      planTier: tierId
    }));
  };

  // Notifications handlers
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notif) => {
    if (notif.type === 'live') {
      handleNavigate('live');
    } else if (notif.type === 'resource') {
      handleNavigate('library');
    } else if (notif.type === 'replay') {
      handleNavigate('replays');
    }
    setIsNotificationsOpen(false);
  };

  // Admin add course
  const handleAddCourse = async (newCourse) => {
    const created = await api.courses.create({
      title: newCourse.title,
      description: newCourse.tagline || '',
    });
    setCourses((current) => [adaptCourse(created, current.length), ...current]);
  };

  // Admin schedule live class
  const handleAddLiveClass = async (newLive) => {
    if (!newLive.courseId) throw new Error('Selecciona el curso de la sesión.');
    const created = await api.liveSessions.create({
      courseId: newLive.courseId,
      title: newLive.title,
      scheduledAt: newLive.scheduledAt,
      durationMinutes: newLive.durationMinutes,
    });
    setLiveClasses((current) => [adaptLiveSession(created, courses), ...current]);
  };

  const handleUpdateUserRole = async (userId, role) => {
    const updated = await api.users.updateRole(userId, role);
    setUsers((current) => current.map((item) => item.id === userId ? updated : item));
    return updated;
  };

  const handleCreateUser = async (input) => {
    const created = await api.users.create(input);
    setUsers((current) => [created, ...current]);
    return created;
  };

  const handleAssignUserToCourse = async (userId, role, courseId) => {
    if (role === 'mentor' || role === 'docente') {
      const updatedCourse = await api.courses.assignTeacher(courseId, userId);
      setCourses((current) => current.map((course) => course.id === courseId ? adaptCourse(updatedCourse) : course));
      return updatedCourse;
    }
    if (role === 'estudiante' || role === 'alumno') return api.courses.enroll(courseId, userId);
    throw new Error('Los administradores no requieren asignación a cursos.');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  if (isBootstrapping) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/logo.png" alt="Comunidad del Intercambio" style={{ width: 64, height: 64, objectFit: 'contain' }} />
          <p style={{ marginTop: 14, color: 'var(--text-muted)' }}>Conectando con la plataforma…</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, renderizar el portal corporativo de Login
  if (!isAuthenticated) {
    return (
      <LoginView 
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`} data-theme="light">
      {/* Backdrop para móviles al abrir la barra lateral */}
      {isSidebarOpen && (
        <div 
          className="sidebar-mobile-backdrop" 
          onClick={handleToggleSidebar}
          title="Toca para guardar menú lateral"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView}
        onNavigate={handleNavigate}
        currentRole={currentRole}
        user={user}
        liveClasses={liveClasses}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Main Content Area */}
      <div className={`main-content-wrapper ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
        <Header 
          user={user}
          currentRole={currentRole}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadCount={unreadNotificationsCount}
          onOpenMembershipModal={() => setIsMembershipModalOpen(true)}
          onNavigate={handleNavigate}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onLogout={handleLogout}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
        />

        <main className="content-body">
          {appError && (
            <div role="alert" style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 10, background: '#FFF7ED', border: '1px solid #FED7AA', color: '#9A3412', display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <span>{appError}</span>
              <button type="button" onClick={() => setAppError('')} style={{ border: 0, background: 'transparent', color: 'inherit', cursor: 'pointer', fontWeight: 700 }}>Cerrar</button>
            </div>
          )}
          {/* Vista: Dashboard de Estudiante */}
          {currentView === 'dashboard' && (
            <DashboardView 
              user={user}
              courses={courses}
              liveClasses={liveClasses}
              onSelectCourse={handleSelectCourse}
              onSelectLesson={(lessonId) => {
                setSelectedCourse(courses[0]);
                setSelectedLessonId(lessonId);
                setCurrentView('course-player');
                if (courses[0]) window.history.pushState({}, '', pathForView('course-player', courses[0].id));
              }}
              onOpenLiveSession={(live) => setLiveSessionModalData(live)}
              onNavigate={handleNavigate}
            />
          )}

          {/* Vista: Dashboard del Mentor */}
          {currentView === 'mentor-dashboard' && (
            <MentorDashboardView 
              user={user}
              liveClasses={liveClasses}
              courses={courses}
              onOpenLiveSession={(live) => setLiveSessionModalData(live)}
              onNavigate={handleNavigate}
            />
          )}

          {/* Vista: Catálogo de Cursos */}
          {currentView === 'courses' && (
            <CoursesListView 
              courses={courses}
              onSelectCourse={handleSelectCourse}
            />
          )}

          {/* Vista: Reproductor de Cursos y Lecciones */}
          {currentView === 'course-player' && selectedCourse && (
            <CoursePlayerView 
              course={selectedCourse}
              initialLessonId={selectedLessonId}
              onBack={() => handleNavigate('courses')}
              onToggleLessonCompletion={handleToggleLessonCompletion}
            />
          )}

          {/* Vista: Clases en Vivo & Calendario */}
          {currentView === 'live' && (
            <LiveClassesView 
              liveClasses={liveClasses}
              onOpenLiveSession={(live) => setLiveSessionModalData(live)}
              onNavigate={handleNavigate}
            />
          )}

          {/* Vista: Videoteca de Replays (Grabaciones) */}
          {currentView === 'replays' && (
            <ReplaysView 
              replays={replays}
              onNavigate={handleNavigate}
              onPlay={(video) => api.videos.playback(video.id)}
            />
          )}

          {/* Vista: Biblioteca de Recursos y Plantillas */}
          {currentView === 'library' && (
            <LibraryView 
              resources={resources}
            />
          )}

          {/* Vista: Mentores de Élite */}
          {currentView === 'mentors' && (
            <MentorsView 
              mentors={mentors}
              courses={courses}
              onSelectCourse={handleSelectCourse}
            />
          )}

          {/* Vista: Comunidad & Debates */}
          {currentView === 'community' && (
            <CommunityView 
              threads={communityThreads}
              user={user}
            />
          )}

          {/* Vista: Mi Perfil & Datos */}
          {currentView === 'profile' && (
            <ProfileView 
              user={user}
              onUpdateUser={handleUpdateUser}
              courses={courses}
              onNavigate={handleNavigate}
            />
          )}


          {/* Vistas de Administración (CMS) */}
          {(currentView === 'admin-overview' || currentView === 'admin-courses' || currentView === 'admin-live' || currentView === 'admin-users') && (
            <AdminView 
              courses={courses}
              liveClasses={liveClasses}
              onAddCourse={handleAddCourse}
              onAddLiveClass={handleAddLiveClass}
              mentors={mentors}
              users={users}
              currentUserId={user.id}
              onUpdateUserRole={handleUpdateUserRole}
              onAssignUserToCourse={handleAssignUserToCourse}
              onCreateUser={handleCreateUser}
              currentView={currentView}
              onNavigate={handleNavigate}
            />
          )}
        </main>
      </div>

      {/* Modal de Notificaciones */}
      <NotificationsModal 
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onNotificationClick={handleNotificationClick}
      />

      {/* Modal de Planes de Membresía */}
      <MembershipModal 
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
        plans={membershipPlans}
        currentTier={user.planTier}
        onSelectTier={handleSelectTier}
      />

      {/* Modal de Sala de Clase en Vivo */}
      <LiveSessionModal 
        isOpen={!!liveSessionModalData}
        onClose={() => setLiveSessionModalData(null)}
        liveClass={liveSessionModalData}
        onJoin={async (session) => api.liveSessions.join(session.id)}
      />
    </div>
  );
}

export default App;
