import { Search, Filter, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MonitoringTable = ({ searchTerm, setSearchTerm, filterJurusan, setFilterJurusan, filteredClasses }) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'AMAN':
            case 'OK':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'TELAT':
                return 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse';
            case 'KOSONG':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'ALPHA':
                return 'bg-red-100 text-red-700 border-red-200 font-bold';
            case 'BELUM':
                return 'bg-gray-100 text-gray-500 border-gray-200 dashed border';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-rose-200 shadow-lg"></div>
                    <h2 className="text-lg font-bold text-slate-800">Live Monitoring Kelas</h2>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Cari dosen/MK..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full md:w-56 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                </div>
            </div>

            <div className="overflow-x-auto">
                <motion.table
                    className="w-full text-left"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                        <tr>
                            <th className="px-6 py-4">Ruang</th>
                            <th className="px-6 py-4">Dosen</th>
                            <th className="px-6 py-4">Matakuliah</th>
                            <th className="px-6 py-4">Jadwal Kuliah</th>
                            <th className="px-6 py-4">Masuk</th>
                            <th className="px-6 py-4">Keluar</th>
                            <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <AnimatePresence>
                            {filteredClasses.length > 0 ? filteredClasses.map((rowItem) => (
                                <motion.tr
                                    key={rowItem.id}
                                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                                    variants={item}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    whileHover={{ backgroundColor: "rgba(241, 245, 249, 0.8)", scale: 1.01, transition: { duration: 0.2 } }}
                                >
                                    <td className="px-6 py-4 font-bold text-teal-600">{rowItem.ruang}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">
                                                {rowItem.dosen.charAt(rowItem.dosen.indexOf(' ') + 1)}
                                            </div>
                                            <span className="font-medium text-slate-700">{rowItem.dosen}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{rowItem.matakuliah}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 italic">{rowItem.jadwal}</td>
                                    <td className="px-6 py-4 font-mono text-sm text-emerald-600 font-bold">{rowItem.masuk}</td>
                                    <td className="px-6 py-4 font-mono text-sm text-rose-500 font-bold">{rowItem.keluar}</td>
                                    <td className="px-6 py-4 text-center">
                                        <motion.span
                                            whileHover={{ scale: 1.1 }}
                                            className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase border inline-block ${getStatusStyle(rowItem.status)}`}
                                        >
                                            {rowItem.status}
                                        </motion.span>
                                    </td>
                                </motion.tr>
                            )) : (
                                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <td colSpan="6" className="px-6 py-16 text-center text-slate-400">
                                        Tidak ada data yang cocok dengan filter.
                                    </td>
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </motion.table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                <button className="text-teal-600 text-sm font-bold hover:text-teal-700 hover:underline flex items-center gap-1 transition-colors">
                    Lihat Semua Jadwal <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default MonitoringTable;
