import React, { useState, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';

const CoursePickerModal = ({ isOpen, onClose, onSelect, courses }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const searchLower = searchTerm.toLowerCase();
            return (
                (course.code && course.code.toLowerCase().includes(searchLower)) ||
                (course.name && course.name.toLowerCase().includes(searchLower))
            );
        });
    }, [courses, searchTerm]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">Pilih Mata Kuliah</h3>
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
                            placeholder="Cari berdasarkan Kode atau Nama Mata Kuliah..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {filteredCourses.length > 0 ? (
                        <div className="grid gap-2">
                            {filteredCourses.map((course) => (
                                <button
                                    key={course.id}
                                    onClick={() => onSelect(course)}
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-teal-50 border border-transparent hover:border-teal-100 transition-all group text-left"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded font-mono">
                                                {course.code || course.kode}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium">
                                                {course.sks_t || course.sks || 0} SKS
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-gray-700 group-hover:text-teal-700">{course.name || course.nama}</h4>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-teal-600 text-white p-2 rounded-full">
                                        <Check size={16} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <p>Tidak ada mata kuliah yang ditemukan.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 text-right bg-gray-50 rounded-b-2xl">
                    <span className="text-xs text-gray-400 mr-2">
                        Menampilkan {filteredCourses.length} dari {courses.length} mata kuliah
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CoursePickerModal;
