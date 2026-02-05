import React, { useState } from 'react';

import LoginMhs from './components/mhs/LoginMhs';
import SuccessMhs from './components/mhs/SuccessMhs';
import DashboardMhsContent from './components/mhs/DashboardMhsContent';

import { supabase } from './lib/supabaseClient';

const DashboardMhs = ({ onBack }) => {
    // State for Navigation/Auth
    const [session, setSession] = useState(null);

    React.useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // State for Attendance Reporting
    const [attendanceStatus, setAttendanceStatus] = useState(null); // 'hadir' or 'tidak_hadir'
    const [entryTime, setEntryTime] = useState(null);
    const [exitTime, setExitTime] = useState(null);
    const [hasTask, setHasTask] = useState(null); // true or false
    const [taskDetail, setTaskDetail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeSchedule, setActiveSchedule] = useState(null);

    const fetchActiveSchedule = async () => {
        const days = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
        const now = new Date();
        const today = days[now.getDay()];
        const currentTime = now.toLocaleTimeString('en-GB', { hour12: false });

        // 1. Fetch Schedules
        const { data: schedules, error: schedError } = await supabase
            .from('schedules')
            .select(`
                id,
                start_time,
                end_time,
                class_name,
                room,
                lecturer_id,
                courses (name, code, sks_t, sks_p, sks_pr),
                lecturers (name)
            `)
            .eq('day', today)
            .order('start_time', { ascending: true });

        if (schedError || !schedules) return;

        // 2. Fetch Logs for today (to filter out reported ones)
        // Filter logs created since today 00:00
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const scheduleIds = schedules.map(s => s.id);
        const { data: logs } = await supabase
            .from('attendance_logs')
            .select('schedule_id')
            .in('schedule_id', scheduleIds)
            .gte('created_at', todayStart.toISOString());

        const reportedScheduleIds = logs ? logs.map(l => l.schedule_id) : [];

        // 3. Filter: Not reported AND Not ended
        const upcomingSchedules = schedules.filter(s => {
            const isReported = reportedScheduleIds.includes(s.id);
            // Compare time string "HH:mm:ss"
            const isEnded = s.end_time < currentTime;
            return !isReported && !isEnded;
        });

        // 4. Set Active (First available)
        setActiveSchedule(upcomingSchedules.length > 0 ? upcomingSchedules[0] : null);
    };

    React.useEffect(() => {
        if (session) {
            fetchActiveSchedule();
        }
    }, [session]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        // Reset local state if needed
        resetForm();
    };

    const handleEntry = () => {
        const now = new Date();
        setEntryTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    const handleExit = () => {
        const now = new Date();
        setExitTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    const handleSubmit = async () => {
        if (!attendanceStatus) {
            alert("Harap pilih status kehadiran dosen.");
            return;
        }

        if (!activeSchedule) {
            alert("Tidak ada jadwal aktif untuk dilapor.");
            return;
        }

        try {
            const payload = {
                schedule_id: activeSchedule.id,
                lecturer_id: activeSchedule.lecturer_id,
                status: attendanceStatus === 'hadir' ? 'HADIR' : 'ALPHA',
                check_in_time: entryTime ? new Date().toISOString() : null
            };

            const { error } = await supabase
                .from('attendance_logs')
                .insert([payload]);

            if (error) throw error;

            setIsSubmitted(true);
        } catch (error) {
            console.error("Submit Error:", error);
            alert("Gagal mengirim laporan: " + error.message);
        }
    };

    // Function to reset the form states
    const resetForm = () => {
        setAttendanceStatus(null);
        setEntryTime(null);
        setEntryTimestamp(null);
        setExitTime(null);
        setExitTimestamp(null);
        setHasTask(null);
        setTaskDetail('');
        setIsSubmitted(false);
        fetchActiveSchedule(); // Refresh to get next schedule
    };

    // 1. View: Login Screen
    if (!session) {
        return <LoginMhs onBack={onBack} />;
    }

    // 2. View: Success Screen
    if (isSubmitted) {
        return <SuccessMhs onReset={resetForm} onLogout={handleLogout} submittedSchedule={activeSchedule} />;
    }

    // 3. View: Main Reporting App
    return (
        <DashboardMhsContent
            onLogout={handleLogout}
            attendanceStatus={attendanceStatus}
            setAttendanceStatus={setAttendanceStatus}
            entryTime={entryTime}
            handleEntry={handleEntry}
            exitTime={exitTime}
            handleExit={handleExit}
            hasTask={hasTask}
            setHasTask={setHasTask}
            taskDetail={taskDetail}
            setTaskDetail={setTaskDetail}
            handleSubmit={handleSubmit}
            activeSchedule={activeSchedule}
        />
    );
};

export default DashboardMhs;
