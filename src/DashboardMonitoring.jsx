import React, { useState, useMemo } from 'react';

import MonitoringHeader from './components/monitoring/MonitoringHeader';
import MonitoringStats from './components/monitoring/MonitoringStats';
import MonitoringTable from './components/monitoring/MonitoringTable';

// Data simulasi kelas
import { supabase } from './lib/supabaseClient';

const DashboardMonitoring = ({ onLoginClick }) => {
    const [filterJurusan, setFilterJurusan] = useState('Semua');
    const [searchTerm, setSearchTerm] = useState('');
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Helpers
    const getTodayName = () => {
        const days = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
        return days[new Date().getDay()];
    };

    // Fetch Initial Data
    const fetchDashboardData = async () => {
        setLoading(true);
        const today = getTodayName();

        // 1. Get Schedules for Today
        const { data: schedules, error: schedError } = await supabase
            .from('schedules')
            .select(`
                id, room, start_time, end_time, class_name, day,
                course:courses(name, code),
                lecturer:lecturers(name)
            `)
            .eq('day', today);

        if (schedError) {
            console.error('Error fetching schedules:', schedError);
            setLoading(false);
            return;
        }

        // 2. Get Attendance Logs for Today
        // Start of today in UTC? Or just grab recent logs. 
        // For simplicity, we just grab logs created today.
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const { data: logs, error: logsError } = await supabase
            .from('attendance_logs')
            .select('*')
            .gte('created_at', startOfDay.toISOString());

        if (logsError) console.error('Error fetching logs:', logsError);

        // 3. Merge Data
        const mergedData = schedules.map(sch => {
            const log = logs?.find(l => l.schedule_id === sch.id);
            return {
                id: sch.id,
                ruang: sch.room,
                dosen: sch.lecturer?.name || 'Unknown',
                matakuliah: sch.course?.name || 'Unknown',
                jadwal: `${sch.start_time.slice(0, 5)} - ${sch.end_time.slice(0, 5)}`,
                masuk: log?.check_in_time ? new Date(log.check_in_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-',
                keluar: log?.check_out_time ? new Date(log.check_out_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-',
                status: log?.status || 'BELUM', // Default status
                jurusan: 'Informatika' // Dummy for filtering as it's not in DB yet
            };
        });

        setClasses(mergedData);
        setLoading(false);
    };

    React.useEffect(() => {
        fetchDashboardData();

        // Realtime Subscription
        const subscription = supabase
            .channel('public:attendance_logs')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_logs' }, (payload) => {
                console.log('Realtime update:', payload);
                fetchDashboardData(); // Refresh data on any change
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const filteredClasses = useMemo(() => {
        return classes.filter(cls => {
            const matchesJurusan = filterJurusan === 'Semua' || cls.jurusan === filterJurusan;
            const matchesSearch = cls.dosen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cls.matakuliah.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesJurusan && matchesSearch;
        });
    }, [filterJurusan, searchTerm, classes]);

    // Calculate Stats
    const stats = useMemo(() => {
        return {
            total: classes.length,
            hadir: classes.filter(c => c.status === 'HADIR' || c.status === 'OK' || c.status === 'AMAN').length,
            telat: classes.filter(c => c.status === 'TELAT').length,
            kosong: classes.filter(c => c.status === 'ALPHA' || c.status === 'KOSONG').length // Or just empty logic
        };
    }, [classes]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header / Navbar */}
            <MonitoringHeader onLoginClick={onLoginClick} />

            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* Ringkasan Hari Ini */}
                <MonitoringStats stats={stats} />

                <div className="flex flex-col gap-8">
                    {/* Live Monitoring Section */}
                    <div className="w-full">
                        <MonitoringTable
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            filterJurusan={filterJurusan}
                            setFilterJurusan={setFilterJurusan}
                            filteredClasses={filteredClasses}
                        />
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-slate-200 py-10 mt-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-slate-500 text-sm font-medium">© 2026 Sistem Informasi Monitoring Perkuliahan Terpadu.</p>
                    <p className="mt-2 font-bold text-slate-300 uppercase tracking-widest text-[10px]">Fakultas Teknologi Informasi</p>
                </div>
            </footer>
        </div>
    );
};

export default DashboardMonitoring;
