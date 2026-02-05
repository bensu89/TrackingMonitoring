import React, { useState } from 'react';
import DashboardMhs from './DashboardMhs';
import DashboardBAAK from './DashboardBAAK';
import DashboardMonitoring from './DashboardMonitoring';
import { LogIn, X, User, GraduationCap } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('monitoring'); // 'monitoring', 'student', 'admin'
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Navigate to specific login view
  const handleNavigate = (view) => {
    setCurrentView(view);
    setShowLoginModal(false);
  };

  // Return to monitoring (Logout)
  const handleLogout = () => {
    setCurrentView('monitoring');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* View Rendering */}
      {currentView === 'monitoring' && (
        <DashboardMonitoring onLoginClick={() => setShowLoginModal(true)} />
      )}

      {currentView === 'student' && (
        <DashboardMhs onBack={handleLogout} />
      )}

      {currentView === 'admin' && (
        <ErrorBoundary>
          <DashboardBAAK onLogout={handleLogout} />
        </ErrorBoundary>
      )}

      {/* Login Selection Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Pilih Portal Login</h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 grid gap-4">
              <button
                onClick={() => handleNavigate('student')}
                className="flex items-center p-4 border-2 border-slate-100 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all group"
              >
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <GraduationCap size={24} />
                </div>
                <div className="ml-4 text-left">
                  <p className="font-bold text-gray-800 group-hover:text-blue-700">Login Mahasiswa</p>
                  <p className="text-xs text-gray-500">Lapor kehadiran/tugas kelas</p>
                </div>
              </button>

              <button
                onClick={() => handleNavigate('admin')}
                className="flex items-center p-4 border-2 border-slate-100 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
              >
                <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <User size={24} />
                </div>
                <div className="ml-4 text-left">
                  <p className="font-bold text-gray-800 group-hover:text-indigo-700">Login BAAK / Admin</p>
                  <p className="text-xs text-gray-500">Kelola jadwal & data dosen</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
