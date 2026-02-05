import React from 'react';
import { Bell, User } from 'lucide-react';

const MonitoringHeader = ({ onLoginClick }) => {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 py-4 md:py-0 md:h-20 flex items-center justify-between">
                <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-200 shrink-0">
                        K
                    </div>
                    <div>
                        <h1 className="text-sm md:text-xl font-bold leading-none text-slate-800 tracking-tight">FAKULTAS TEKNOLOGI INFORMASI</h1>
                        <p className="text-[10px] md:text-xs font-semibold text-teal-600 uppercase tracking-widest mt-1">Monitoring Perkuliahan</p>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="hidden md:block text-slate-400 hover:text-teal-600 transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="pl-0 md:pl-6 md:border-l border-slate-200">
                        <button
                            onClick={onLoginClick}
                            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white p-2 md:px-5 md:py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            <User size={18} />
                            <span className="hidden md:inline">Login Sistem</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default MonitoringHeader;
