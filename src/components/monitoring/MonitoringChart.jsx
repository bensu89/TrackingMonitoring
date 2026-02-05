import React from 'react';
import { TrendingUp, Users } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const weeklyData = [
    { day: 'Sen', telat: 0, onTime: 0 },
    { day: 'Sel', telat: 0, onTime: 0 },
    { day: 'Rab', telat: 0, onTime: 0 },
    { day: 'Kam', telat: 0, onTime: 0 },
    { day: 'Jum', telat: 0, onTime: 0 },
    { day: 'Sab', telat: 0, onTime: 0 },
];

const MonitoringChart = () => {
    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                        <TrendingUp size={20} className="text-teal-600" />
                        Tren Kedisiplinan
                    </h2>
                </div>

                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyData}>
                            <defs>
                                <linearGradient id="colorTelat" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100 ring-1 ring-slate-100">
                                                <p className="text-sm font-bold text-slate-700 mb-1">{label === 'Sen' ? 'Senin' : label === 'Sel' ? 'Selasa' : label === 'Rab' ? 'Rabu' : label === 'Kam' ? 'Kamis' : label === 'Jum' ? 'Jumat' : 'Sabtu'}</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                                    <p className="text-xs font-semibold text-slate-500">
                                                        Terlambat: <span className="text-rose-600 font-bold text-sm">{payload[0].value}</span> Dosen
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="telat"
                                stroke="#ef4444"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTelat)"
                                name="Terlambat"
                                animationDuration={2000}
                                animationEasing="ease-in-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <p className="mt-4 text-xs text-center text-slate-400 font-medium">
                    * Grafik menunjukkan jumlah keterlambatan dosen per hari dalam seminggu terakhir.
                </p>
            </div>

            <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-8 rounded-2xl shadow-lg shadow-teal-200 text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Butuh Bantuan?</h3>
                    <p className="text-teal-100 text-sm mb-6 leading-relaxed">Laporkan kendala teknis atau ketidakhadiran dosen langsung ke sistem BAAK Pusat secara real-time.</p>
                    <button className="bg-white text-teal-700 px-6 py-3 rounded-xl text-sm font-bold hover:bg-teal-50 transition-colors shadow-sm">
                        Hubungi IT Center
                    </button>
                </div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute bottom-0 right-0 mb-4 mr-4 opacity-20">
                    <Users size={100} />
                </div>
            </div>
        </div>
    );
};

export default MonitoringChart;
