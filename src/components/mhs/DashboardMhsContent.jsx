import React from 'react';
import { ChevronLeft, Info, Clock, UserCheck, CheckCircle, BookOpen, Send } from 'lucide-react';

const DashboardMhsContent = ({
    onLogout,
    attendanceStatus,
    setAttendanceStatus,
    entryTime,
    handleEntry,
    exitTime,
    handleExit,
    hasTask,
    setHasTask,
    taskDetail,
    setTaskDetail,
    handleSubmit,
    activeSchedule // New Prop
}) => {
    return (
        <div className="bg-slate-50 max-w-md mx-auto shadow-2xl flex flex-col font-sans text-slate-800 min-h-screen">
            {/* Header */}
            <header className="bg-white text-slate-800 p-6 flex items-center shadow-sm sticky top-0 z-10 border-b border-slate-100">
                <button onClick={onLogout} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-500">
                    <ChevronLeft size={24} />
                </button>
                <div className="ml-4">
                    <h1 className="text-lg font-black leading-tight uppercase tracking-tight text-teal-700">
                        {activeSchedule ? activeSchedule.courses?.name : 'TIDAK ADA JADWAL'}
                    </h1>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                        {activeSchedule ? `RUANG ${activeSchedule.room} (${activeSchedule.class_name})` : 'Pelaporan Perkuliahan'}
                    </p>
                </div>
            </header>

            <main className="p-4 space-y-4 flex-1">
                {/* Section: Informasi Jadwal */}
                <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center text-teal-600 mb-4 border-b border-slate-50 pb-3">
                        <Info size={16} className="mr-2" />
                        <h2 className="font-bold text-[10px] uppercase tracking-widest">Informasi Jadwal</h2>
                    </div>
                    {activeSchedule ? (
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Dosen Pengampu</p>
                                <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-[10px] font-bold">
                                    {(activeSchedule.courses?.sks_t || 0) + (activeSchedule.courses?.sks_p || 0)} SKS
                                </span>
                            </div>
                            <p className="text-slate-800 font-bold text-lg">{activeSchedule.lecturers?.name || 'Dosen Belum Ditentukan'}</p>
                            <div className="flex items-center text-slate-500 text-sm mt-2 font-medium">
                                <Clock size={16} className="mr-2 text-slate-300" />
                                <span>Waktu : {activeSchedule.start_time?.slice(0, 5)} - {activeSchedule.end_time?.slice(0, 5)} WIB</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400 text-sm italic">
                            Tidak ada jadwal perkuliahan aktif saat ini.
                        </div>
                    )}
                </section>

                {/* Section: Status Kehadiran Dosen */}
                <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center text-slate-700 mb-5">
                        <UserCheck size={16} className="mr-2 text-teal-600" />
                        <h2 className="font-bold text-[10px] uppercase tracking-widest">Status Kehadiran Dosen</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <label className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${attendanceStatus === 'hadir' ? 'border-teal-500 bg-teal-50/50 shadow-sm' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${attendanceStatus === 'hadir' ? 'border-teal-600' : 'border-slate-300'}`}>
                                {attendanceStatus === 'hadir' && <div className="w-3 h-3 bg-teal-600 rounded-full"></div>}
                            </div>
                            <input
                                type="radio"
                                name="status"
                                className="hidden"
                                onChange={() => setAttendanceStatus('hadir')}
                                checked={attendanceStatus === 'hadir'}
                            />
                            <span className={`font-bold ${attendanceStatus === 'hadir' ? 'text-teal-800' : 'text-slate-500'}`}>Hadir di Kelas</span>
                        </label>
                        <label className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${attendanceStatus === 'tidak_hadir' ? 'border-rose-500 bg-rose-50/50 shadow-sm' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${attendanceStatus === 'tidak_hadir' ? 'border-rose-600' : 'border-slate-300'}`}>
                                {attendanceStatus === 'tidak_hadir' && <div className="w-3 h-3 bg-rose-600 rounded-full"></div>}
                            </div>
                            <input
                                type="radio"
                                name="status"
                                className="hidden"
                                onChange={() => setAttendanceStatus('tidak_hadir')}
                                checked={attendanceStatus === 'tidak_hadir'}
                            />
                            <span className={`font-bold ${attendanceStatus === 'tidak_hadir' ? 'text-rose-800' : 'text-slate-500'}`}>Tidak Hadir / Kelas Kosong</span>
                        </label>
                    </div>
                </section>

                {/* Section: Jika Dosen Hadir */}
                {attendanceStatus === 'hadir' && (
                    <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center text-teal-600 mb-5">
                            <Clock size={16} className="mr-2" />
                            <h2 className="font-bold text-[10px] uppercase tracking-widest">Pencatatan Waktu</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <button
                                    onClick={handleEntry}
                                    className={`w-full py-5 rounded-2xl font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${entryTime ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-teal-500/30'}`}
                                >
                                    {entryTime ? <CheckCircle size={18} /> : null}
                                    {entryTime ? 'DOSEN SUDAH MASUK' : 'CATAT DOSEN MASUK'}
                                </button>
                                {entryTime && (
                                    <p className="text-center text-xs text-emerald-600 mt-2 font-bold bg-emerald-50 py-2 rounded-xl mx-4">
                                        Tercatat Pukul: {entryTime}
                                    </p>
                                )}
                            </div>

                            <div>
                                <button
                                    onClick={handleExit}
                                    disabled={!entryTime}
                                    className={`w-full py-5 rounded-2xl font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${!entryTime ? 'bg-slate-100 text-slate-300' : exitTime ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-amber-500/30'}`}
                                >
                                    {exitTime ? <CheckCircle size={18} /> : null}
                                    {exitTime ? 'PERKULIAHAN SELESAI' : 'CATAT DOSEN KELUAR'}
                                </button>
                                {exitTime && (
                                    <p className="text-center text-xs text-emerald-600 mt-2 font-bold bg-emerald-50 py-2 rounded-xl mx-4">
                                        Tercatat Pukul: {exitTime}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Section: Jika Dosen Memberi Tugas */}
                <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center text-slate-700 mb-5">
                        <BookOpen size={16} className="mr-2 text-teal-600" />
                        <h2 className="font-bold text-[10px] uppercase tracking-widest">Tugas Perkuliahan</h2>
                    </div>

                    <div className="flex items-center space-x-4 mb-5">
                        <span className="text-sm font-bold text-slate-600">Ada Tugas?</span>
                        <div className="flex bg-slate-100 p-1.5 rounded-xl w-full">
                            <button
                                onClick={() => setHasTask(true)}
                                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${hasTask === true ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Ya
                            </button>
                            <button
                                onClick={() => setHasTask(false)}
                                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${hasTask === false ? 'bg-white text-slate-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Tidak
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Rincian Tugas</label>
                        <textarea
                            placeholder="Tuliskan detail tugas di sini..."
                            value={taskDetail}
                            onChange={(e) => setTaskDetail(e.target.value)}
                            disabled={hasTask === false}
                            className={`w-full p-4 text-sm border-2 rounded-2xl h-32 focus:border-teal-500 outline-none resize-none transition-all ${hasTask === false ? 'bg-slate-50 border-slate-100 opacity-50' : 'bg-white border-slate-200 focus:bg-slate-50'}`}
                        ></textarea>
                    </div>
                </section>
            </main>

            {/* Footer / Action Button */}
            <footer className="p-6 bg-white border-t border-slate-100 sticky bottom-0 z-10">
                <button
                    onClick={handleSubmit}
                    disabled={!attendanceStatus}
                    className={`w-full py-5 rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-sm shadow-xl transition-all ${attendanceStatus ? 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 hover:shadow-slate-500/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                    <Send size={18} className="mr-3" />
                    Kirim Laporan Akhir
                </button>
            </footer>
        </div>
    );
};

export default DashboardMhsContent;
