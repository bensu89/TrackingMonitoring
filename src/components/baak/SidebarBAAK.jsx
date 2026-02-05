import React from 'react';
import { ChevronRight } from 'lucide-react';

const SidebarBAAK = ({ menuItems, activeMenu, setActiveMenu, isOpen }) => {
    return (
        <aside className={`
            fixed top-20 bottom-0 left-0 z-30 w-72 bg-white shadow-2xl transition-all duration-300 ease-in-out
            md:sticky md:top-24 md:bottom-auto md:z-0 md:shadow-none md:bg-transparent
            ${isOpen ? 'translate-x-0 md:w-72' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden'}
        `}>
            <div className="w-72 h-full p-6 md:p-0 overflow-y-auto">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Menu Utama</h2>
                <div className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveMenu(item.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 group whitespace-nowrap ${activeMenu === item.id
                                ? 'bg-teal-600 text-white shadow-lg shadow-teal-100 scale-105'
                                : 'bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-600 border border-transparent'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <item.icon size={20} className={`min-w-[20px] ${activeMenu === item.id ? 'text-white' : 'text-slate-400 group-hover:text-teal-600'}`} />
                                <span className="text-sm font-bold">{item.label}</span>
                            </div>
                            <ChevronRight size={16} className={`min-w-[16px] ${activeMenu === item.id ? 'opacity-100' : 'opacity-0'}`} />
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default SidebarBAAK;
