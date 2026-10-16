import React, { useState } from 'react';
import { 
  currentUser as initialUser, 
  initialCourses, 
  liveClasses as initialLiveClasses, 
  replays as initialReplays, 
  libraryResources as initialResources, 
  mentors as initialMentors, 
  notificationsList as initialNotifications, 
  membershipPlans, 
  communityThreads 
} from './data/mockData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NotificationsModal } from './components/NotificationsModal';
import { MembershipModal } from './components/MembershipModal';
import { LiveSessionModal } from './components/LiveSessionModal';

import { DashboardView } from './views/DashboardView';
import { CoursesListView } from './views/CoursesListView';
import { CoursePlayerView } from './views/CoursePlayerView';
import { LiveClassesView } from './views/LiveClassesView';
import { ReplaysView } from './views/ReplaysView';
import { LibraryView } from './views/LibraryView';
import { MentorsView } from './views/MentorsView';
import { CommunityView } from './views/CommunityView';
import { CertificatesView } from './views/CertificatesView';
import { AdminView } from './views/AdminView';

export function App() {
  // Application State
  const [user, setUser] = useState(initialUser);
  const [courses, setCourses] = useState(initialCourses);
  const [liveClasses, setLiveClasses] = useState(initialLiveClasses);
  const [replays, setReplays] = useState(initialReplays);
  const [resources, setResources] = useState(initialResources);
  const [mentors, setMentors] = useState(initialMentors);
  const [notifications, setNotifications] = useState(initialNotifications);

  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState('student'); // 'student' | 'admin'
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  // Modals State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [liveSessionModalData, setLiveSessionModalData] = useState(null);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Handle Role Switching
  const handleToggleRole = (role) => {
    setCurrentRole(role);
    if (role === 'admin') {
      setCurrentView('admin-overview');
    } else {
      setCurrentView('dashboard');
    }
  };

  // Handle Navigation
  const handleNavigate = (viewId) => {
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Course in Player
  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    // Select first lesson or first uncompleted
    const allLessons = course.modules.flatMap(m => m.lessons);
    const firstUncompleted = allLessons.find(l => !l.completed);
    setSelectedLessonId(firstUncompleted ? firstUncompleted.id : (allLessons[0]?.id || null));
    setCurrentView('course-player');
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
  const handleAddCourse = (newCourse) => {
    setCourses([newCourse, ...courses]);
  };

  // Admin schedule live class
  const handleAddLiveClass = (newLive) => {
    setLiveClasses([newLive, ...liveClasses]);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView}
        onNavigate={handleNavigate}
        currentRole={currentRole}
        user={user}
        onOpenMembershipModal={() => setIsMembershipModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <Header 
          user={user}
          currentRole={currentRole}
          onToggleRole={handleToggleRole}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadCount={unreadNotificationsCount}
          onOpenMembershipModal={() => setIsMembershipModalOpen(true)}
          onNavigate={handleNavigate}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <main className="content-body">
          {/* Vista: Dashboard Principal */}
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
              }}
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

          {/* Vista: Certificaciones */}
          {currentView === 'certificates' && (
            <CertificatesView 
              user={user}
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
      />
    </div>
  );
}

export default App;
