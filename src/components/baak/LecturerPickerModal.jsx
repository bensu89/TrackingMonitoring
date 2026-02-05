import React, { useState, useMemo } from 'react';
import { Search, X, Check, User } from 'lucide-react';

const LecturerPickerModal = ({ isOpen, onClose, onSelect, lecturers }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLecturers = useMemo(() => {
        return lecturers.filter(lecturer => {
            const searchLower = searchTerm.toLowerCase();
            return (
                (lecturer.full_name && lecturer.full_name.toLowerCase().includes(searchLower)) ||
                (lecturer.nama && lecturer.nama.toLowerCase().includes(searchLower)) ||
                (lecturer.nidn && lecturer.nidn.toLowerCase().includes(searchLower))
            );
        });
    }, [lecturers, searchTerm]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">Pilih Dosen</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 bg-slate-50/50 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari Dosen (Nama atau NIDN)..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {filteredLecturers.length > 0 ? (
                        <div className="grid gap-2">
                            {filteredLecturers.map((lecturer) => (
                                <button
                                    key={lecturer.id}
                                    onClick={() => onSelect(lecturer)}
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-teal-50 border border-transparent hover:border-teal-100 transition-all group text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-700 group-hover:text-teal-700">
                                                {lecturer.nama || lecturer.full_name}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                {lecturer.nidn && (
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded font-mono">
                                                        {lecturer.nidn}
                                                    </span>
                                                )}
                                                <span>{lecturer.homebase || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-teal-600 text-white p-2 rounded-full">
                                        <Check size={16} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <p>Tidak ada data dosen yang ditemukan.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 text-right bg-gray-50 rounded-b-2xl">
                    <span className="text-xs text-gray-400 mr-2">
                        Menampilkan {filteredLecturers.length} dari {lecturers.length} dosen
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LecturerPickerModal;
