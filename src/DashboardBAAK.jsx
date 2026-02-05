import React, { useState } from 'react';
import {
    Upload,
    Users,
    BookOpen,
    PlusCircle,
    FileText,
    LogOut,
    Database,
    BookMarked,
    Menu,
    X
} from 'lucide-react';

import LoginBAAK from './components/baak/LoginBAAK';
import SidebarBAAK from './components/baak/SidebarBAAK';
import ModuleInputJadwal from './components/baak/ModuleInputJadwal';
import ModuleMatkul from './components/baak/ModuleMatkul';
import ModuleDosen from './components/baak/ModuleDosen';
import { supabase } from './lib/supabaseClient';

const DashboardBAAK = ({ onLogout }) => {
    const [activeMenu, setActiveMenu] = useState('input-jadwal');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Auto-open on desktop mount
    React.useEffect(() => {
        if (window.innerWidth >= 768) {
            setIsMobileMenuOpen(true);
        }
    }, []);

    // State untuk Data Dosen
    const [dosenList, setDosenList] = useState([]);

    // State untuk Data Mata Kuliah
    const [matkulList, setMatkulList] = useState([]);

    const menuItems = [
        { id: 'upload', label: 'Upload Jadwal (Excel/CSV)', icon: Upload },
        { id: 'matkul', label: 'Kelola Mata Kuliah', icon: BookMarked },
        { id: 'dosen', label: 'Kelola Data Dosen', icon: Users },
        { id: 'mhs', label: 'Kelola Data Mahasiswa & KRS', icon: BookOpen },
        { id: 'input-jadwal', label: 'Input Jadwal Baru', icon: PlusCircle },
    ];

    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [session, setSession] = useState(null); // Added session state

    React.useEffect(() => {
        let mounted = true;

        const checkUser = async () => {
            try {
                // Safety timeout to prevent infinite loading
                const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));

                // Race the session check against timeout
                const sessionPromise = supabase.auth.getSession();

                const { data: { session } } = await Promise.race([sessionPromise, timeout])
                    .catch(() => ({ data: { session: null } })); // Fallback on timeout

                if (mounted) {
                    if (session) {
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('role')
                            .eq('id', session.user.id)
                            .single();

                        if (mounted) setIsAdmin(profile?.role === 'admin');
                    } else {
                        if (mounted) setIsAdmin(false);
                    }
                    if (mounted) setSession(session);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                if (mounted) {
                    setIsAdmin(false);
                    setSession(null);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        checkUser();

        // Fetch Data Master (Dosen & Matkul)
        const fetchDataMaster = async () => {
            const { data: cData } = await supabase.from('courses').select('*');
            // Fetch from dedicated 'lecturers' table
            const { data: lData } = await supabase
                .from('lecturers')
                .select('*')
                .order('name', { ascending: true });

            if (cData) setMatkulList(cData);
            if (lData) {
                // Map 'name' to 'nama' for backward compatibility
                const mapped = lData.map(d => ({ ...d, nama: d.name }));
                setDosenList(mapped);
            }
        };
        fetchDataMaster();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (mounted) {
                setSession(session);
                if (session) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id)
                        .single();
                    if (mounted) setIsAdmin(profile?.role === 'admin');
                } else {
                    if (mounted) setIsAdmin(false);
                }
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const handleLogin = (user) => {
        // Session handled by onAuthStateChange
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        onLogout(); // Go back to landing
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                <button onClick={onLogout} className="text-slate-500 hover:text-red-500 text-sm font-medium transition-colors">
                    Batal (Kembali)
                </button>
            </div>
        );
    }

    // Force login if no session OR not an admin
    if (!session || !isAdmin) {
        return <LoginBAAK onLogin={handleLogin} onLogout={onLogout} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg mr-2"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200">
                            <Database size={28} />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight uppercase">BAAK</h1>
                            <p className="text-xs font-semibold text-teal-600 tracking-widest uppercase">FAKULTAS TEKNOLOGI INFORMASI</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-bold text-slate-700">Admin BAAK</p>
                        </div>
                        <button onClick={handleLogout} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-6 gap-8 relative">
                {/* Sidebar */}
                <SidebarBAAK
                    menuItems={menuItems}
                    activeMenu={activeMenu}
                    setActiveMenu={(id) => {
                        setActiveMenu(id);
                        setIsMobileMenuOpen(false);
                    }}
                    isOpen={isMobileMenuOpen}
                />

                {/* Main Content */}
                <main className="flex-1">
                    {/* MODUL INPUT JADWAL */}
                    {activeMenu === 'input-jadwal' && (
                        <ModuleInputJadwal matkulList={matkulList} dosenList={dosenList} />
                    )}

                    {/* MODUL KELOLA MATA KULIAH */}
                    {activeMenu === 'matkul' && (
                        <ModuleMatkul matkulList={matkulList} setMatkulList={setMatkulList} />
                    )}

                    {/* MODUL KELOLA DOSEN */}
                    {activeMenu === 'dosen' && (
                        <ModuleDosen dosenList={dosenList} setDosenList={setDosenList} />
                    )}

                    {activeMenu !== 'input-jadwal' && activeMenu !== 'dosen' && activeMenu !== 'matkul' && (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                            <FileText size={64} className="mb-4 opacity-20" />
                            <h3 className="text-xl font-bold">Modul "{menuItems.find(i => i.id === activeMenu)?.label}"</h3>
                            <p className="text-sm">Fungsi ini sedang dalam tahap pengembangan sistem.</p>
                        </div>
                    )}
                </main>
            </div>

            <footer className="bg-slate-900 text-slate-500 py-6 text-center text-xs mt-auto">
                <p>© 2026 Biro Administrasi Akademik & Kemahasiswaan (BAAK) - Portal Terpadu</p>
            </footer>
        </div>
    );
};

export default DashboardBAAK;
