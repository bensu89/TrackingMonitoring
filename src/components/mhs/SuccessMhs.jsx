import React from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const SuccessMhs = ({ onReset, onLogout, submittedSchedule }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-sm w-full border border-emerald-100 flex flex-col items-center">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-inner">
                    <CheckCircle size={56} />
                </div>
                <h1 className="text-2xl font-black text-slate-800 mb-2">Laporan Terkirim!</h1>
                <p className="text-slate-500 mb-8 text-sm leading-relaxed px-4 font-medium">
                    Laporan perkuliahan <span className="font-bold text-slate-800">
                        {submittedSchedule ? `${submittedSchedule.courses?.name} (${submittedSchedule.room})` : 'Mata Kuliah'}
                    </span> telah berhasil dikirim ke sistem pusat.
                </p>

                <div className="w-full space-y-3">
                    <button
                        onClick={onReset}
                        className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold flex items-center justify-center shadow-lg hover:bg-teal-700 transition active:scale-95"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Kembali ke Dashboard
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition"
                    >
                        Keluar Sesi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessMhs;
