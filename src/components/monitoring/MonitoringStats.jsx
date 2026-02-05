import React from 'react';
import { LayoutDashboard, Users, Clock, AlertTriangle, MinusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay }}
        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 cursor-pointer"
    >
        <div className={`p-3 rounded-lg ${colorClass}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </motion.div>
);

const MonitoringStats = ({ stats }) => {
    const { total = 0, hadir = 0, telat = 0, kosong = 0 } = stats || {};
    return (
        <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
                    <LayoutDashboard size={24} className="text-teal-600" />
                    Ringkasan Hari Ini
                </h2>
                <span className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                    Kamis, 24 Mei 2026
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="TOTAL KELAS"
                    value={total}
                    icon={Users}
                    colorClass="bg-teal-50 text-teal-600"
                    delay={0.1}
                />
                <StatCard
                    title="HADIR / OK"
                    value={hadir}
                    icon={Clock}
                    colorClass="bg-emerald-50 text-emerald-600"
                    delay={0.2}
                />
                <StatCard
                    title="TERLAMBAT"
                    value={telat}
                    icon={AlertTriangle}
                    colorClass="bg-rose-50 text-rose-600"
                    delay={0.3}
                />
                <StatCard
                    title="BELUM HADIR"
                    value={kosong}
                    icon={MinusCircle}
                    colorClass="bg-amber-50 text-amber-600"
                    delay={0.4}
                />
            </div>
        </section>
    );
};

export default MonitoringStats;
