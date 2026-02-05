import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Save, Plus, Trash2, Info } from 'lucide-react';
import CoursePickerModal from './CoursePickerModal';
import LecturerPickerModal from './LecturerPickerModal';

const ModuleInputJadwal = ({ matkulList = [], dosenList = [] }) => {
    // Initial state: One empty row (no dummy data)
    const [rows, setRows] = useState([
        { id: Date.now(), smt: '', day: 'SENIN', start: '', end: '', room: '', code: '', name: '', sks_t: 0, sks_p: 0, sks_pr: 0, lecturer_id: '' }
    ]);

    // State for saved schedules
    const [savedSchedules, setSavedSchedules] = useState([]);

    const fetchSchedules = async () => {
        const { data, error } = await supabase
            .from('schedules')
            .select(`
                id,
                day,
                start_time,
                end_time,
                room,
                class_name,
                courses (code, name),
                lecturers (name)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching schedules:', error);
        } else {
            setSavedSchedules(data || []);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleDeleteSchedule = async (id) => {
        if (!confirm("Hapus jadwal ini?")) return;
        const { error } = await supabase.from('schedules').delete().eq('id', id);
        if (error) alert(error.message);
        else fetchSchedules();
    };

    const [activeModal, setActiveModal] = useState(null); // 'course' or 'lecturer' or null
    const [currentRowId, setCurrentRowId] = useState(null);

    const handleOpenCourseModal = (rowId) => {
        setCurrentRowId(rowId);
        setActiveModal('course');
    };

    const handleOpenLecturerModal = (rowId) => {
        setCurrentRowId(rowId);
        setActiveModal('lecturer');
    };

    const handleSelectCourse = (course) => {
        if (!currentRowId) return;

        setRows(rows.map(row => {
            if (row.id === currentRowId) {
                return {
                    ...row,
                    code: course.code || course.kode,
                    name: course.name || course.nama,
                    sks_t: course.sks_t || course.sks || 0,
                    sks_p: course.sks_p || 0,
                    sks_pr: course.sks_pr || 0,
                    course_id: course.id
                };
            }
            return row;
        }));
        setActiveModal(null);
        setCurrentRowId(null);
    };

    const handleSelectLecturer = (lecturer) => {
        if (!currentRowId) return;

        setRows(rows.map(row => {
            if (row.id === currentRowId) {
                return {
                    ...row,
                    lecturer_id: lecturer.id
                };
            }
            return row;
        }));
        setActiveModal(null);
        setCurrentRowId(null);
    };

    const addRow = () => {
        setRows([...rows, {
            id: Date.now(),
            smt: '', day: 'SENIN', start: '', end: '', room: '',
            code: '', name: '', sks_t: 0, sks_p: 0, sks_pr: 0, lecturer_id: ''
        }]);
    };

    const deleteRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(r => r.id !== id));
        } else {
            // If it's the last row, clear the data instead of removing it
            setRows([{
                id: Date.now(),
                smt: '', day: 'SENIN', start: '', end: '', room: '',
                code: '', name: '', sks_t: 0, sks_p: 0, sks_pr: 0, lecturer_id: ''
            }]);
        }
    };

    const resetAll = () => {
        if (confirm('Hapus semua data di tabel?')) {
            setRows([{ id: Date.now(), smt: '', day: 'SENIN', start: '', end: '', room: '', code: '', name: '', sks_t: 0, sks_p: 0, sks_pr: 0, lecturer_id: '' }]);
        }
    };

    const updateRow = (id, field, value) => {
        setRows(rows.map(row => {
            if (row.id === id) {
                let updated = { ...row, [field]: value };

                // Auto-fill when code changes
                if (field === 'code') {
                    const match = matkulList.find(c => c.code === value);
                    if (match) {
                        updated.name = match.name;
                        updated.sks_t = match.sks_t || 0;
                        updated.sks_p = match.sks_p || 0;
                        updated.sks_pr = match.sks_pr || 0;
                        updated.course_id = match.id;
                    }
                }

                return updated;
            }
            return row;
        }));
    };

    const handleSave = async () => {
        if (!confirm('Simpan jadwal permanen ke database?')) return;

        const validRows = rows.filter(r => r.code && r.lecturer_id && r.day && r.start);

        if (validRows.length === 0) {
            alert('Tidak ada data valid untuk disimpan. Pastikan Kode Matkul, Dosen, Hari, dan Jam Mulai terisi.');
            return;
        }

        // Validate IDs
        const isUuid = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

        const invalidData = validRows.filter(r => {
            const course = matkulList.find(c => c.code === r.code);
            const cId = r.course_id || course?.id;
            const lId = r.lecturer_id;

            // Course ID checks
            const isCourseValid = cId && !isNaN(cId);
            const isLecturerValid = lId && isUuid(lId);

            if (!isCourseValid) console.warn("Invalid Course ID for:", r.code, cId);
            if (!isLecturerValid) console.warn("Invalid Lecturer ID for:", r.name, lId);

            return !isCourseValid || !isLecturerValid;
        });

        if (invalidData.length > 0) {
            alert(`Gagal: ${invalidData.length} baris memiliki data Dosen atau Matkul yang tidak valid. Cek Console untuk detail.`);
            return;
        }

        const payload = validRows.map(r => {
            const course = matkulList.find(c => c.code === r.code);
            return {
                course_id: r.course_id || course?.id,
                lecturer_id: r.lecturer_id,
                class_name: r.smt,
                day: r.day,
                start_time: r.start,
                end_time: r.end,
                room: r.room
            };
        });



        const { data, error } = await supabase.from('schedules').insert(payload).select();

        if (error) {
            console.error("Supabase Save Error:", error);
            alert('Gagal Simpan ke Database: ' + error.message + ' (' + error.details + ')');
        } else {
            alert('Berhasil menyimpan ' + validRows.length + ' jadwal!');
            setRows([{ id: Date.now(), smt: '', day: 'SENIN', start: '', end: '', room: '', code: '', name: '', sks_t: 0, sks_p: 0, sks_pr: 0, lecturer_id: '' }]);
            fetchSchedules(); // Refresh the list
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-teal-50 to-white">
                    <div>
                        <h2 className="font-bold text-gray-800 text-xl">Input Jadwal Perkuliahan</h2>
                        <p className="text-gray-500 text-sm">Ketik Kode Matkul untuk auto-fill data</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={resetAll} className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors">
                            <Trash2 size={18} /> Reset
                        </button>
                        <button onClick={addRow} className="flex items-center gap-2 text-teal-600 bg-teal-50 px-4 py-2 rounded-lg font-semibold hover:bg-teal-100 transition-colors">
                            <Plus size={18} /> Tambah Baris
                        </button>
                        <button onClick={handleSave} className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 shadow-md transition-all">
                            <Save size={18} /> Simpan
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-xs border-b">
                            <tr>
                                <th className="px-3 py-3 text-center w-10">#</th>
                                <th className="px-3 py-3 text-left">Kelas</th>
                                <th className="px-3 py-3 text-left">Hari</th>
                                <th className="px-3 py-3 text-left">Mulai</th>
                                <th className="px-3 py-3 text-left">Selesai</th>
                                <th className="px-3 py-3 text-left">Ruang</th>
                                <th className="px-3 py-3 text-left">Kode</th>
                                <th className="px-3 py-3 text-left">Mata Kuliah</th>
                                <th className="px-3 py-3 text-center">T</th>
                                <th className="px-3 py-3 text-center">P</th>
                                <th className="px-3 py-3 text-center">PR</th>
                                <th className="px-3 py-3 text-center">Total</th>
                                <th className="px-3 py-3 text-left">Dosen</th>
                                <th className="px-3 py-3 text-center w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rows.map((row, index) => (
                                <tr key={row.id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="px-3 py-2 text-center text-gray-400 font-mono">{index + 1}</td>
                                    <td className="px-1 py-1">
                                        <input type="text" value={row.smt} onChange={e => updateRow(row.id, 'smt', e.target.value)}
                                            className="w-20 px-2 py-1.5 border border-gray-200 rounded focus:border-teal-400 focus:ring-1 focus:ring-teal-200 outline-none transition-colors" placeholder="IF-1A" />
                                    </td>
                                    <td className="px-1 py-1">
                                        <select value={row.day} onChange={e => updateRow(row.id, 'day', e.target.value)}
                                            className="w-24 px-2 py-1.5 border border-gray-200 rounded focus:border-teal-400 outline-none bg-white">
                                            {['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'].map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-1 py-1">
                                        <input type="time" value={row.start} onChange={e => updateRow(row.id, 'start', e.target.value)}
                                            className="w-24 px-2 py-1.5 border border-gray-200 rounded focus:border-teal-400 outline-none" />
                                    </td>
                                    <td className="px-1 py-1">
                                        <input type="time" value={row.end} onChange={e => updateRow(row.id, 'end', e.target.value)}
                                            className="w-24 px-2 py-1.5 border border-gray-200 rounded focus:border-teal-400 outline-none" />
                                    </td>
                                    <td className="px-1 py-1">
                                        <input type="text" value={row.room} onChange={e => updateRow(row.id, 'room', e.target.value)}
                                            className="w-16 px-2 py-1.5 border border-gray-200 rounded focus:border-teal-400 outline-none uppercase" placeholder="L-01" />
                                    </td>
                                    <td className="px-1 py-1">
                                        <button
                                            onClick={() => handleOpenCourseModal(row.id)}
                                            className="w-32 px-2 py-1.5 border border-yellow-300 bg-yellow-50 rounded focus:border-teal-400 outline-none font-mono text-xs text-left truncate hover:bg-yellow-100 transition-colors"
                                        >
                                            {row.code ? (
                                                <span className="font-bold text-teal-700">{row.code}</span>
                                            ) : (
                                                <span className="text-gray-400 italic">Pilih Kode...</span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-1 py-1">
                                        <input type="text" value={row.name} onChange={e => updateRow(row.id, 'name', e.target.value)}
                                            className="w-40 px-2 py-1.5 border border-gray-200 rounded focus:border-teal-400 outline-none text-gray-600" placeholder="Auto-fill..." />
                                    </td>
                                    <td className="px-1 py-1 text-center">
                                        <input type="number" min="0" value={row.sks_t} onChange={e => updateRow(row.id, 'sks_t', parseInt(e.target.value) || 0)}
                                            className="w-10 px-1 py-1.5 border border-gray-200 rounded focus:border-teal-400 outline-none text-center" />
                                    </td>
                                    <td className="px-1 py-1 text-center">
                                        <input type="number" min="0" value={row.sks_p} onChange={e => updateRow(row.id, 'sks_p', parseInt(e.target.value) || 0)}
                                            className="w-10 px-1 py-1.5 border border-gray-200 rounded focus:border-teal-400 outline-none text-center" />
                                    </td>
                                    <td className="px-1 py-1 text-center">
                                        <input type="number" min="0" value={row.sks_pr} onChange={e => updateRow(row.id, 'sks_pr', parseInt(e.target.value) || 0)}
                                            className="w-10 px-1 py-1.5 border border-gray-200 rounded focus:border-teal-400 outline-none text-center" />
                                    </td>
                                    <td className="px-2 py-1 text-center font-bold text-teal-600 bg-teal-50/50">
                                        {(row.sks_t || 0) + (row.sks_p || 0) + (row.sks_pr || 0)}
                                    </td>
                                    <td className="px-1 py-1">
                                        <button
                                            onClick={() => handleOpenLecturerModal(row.id)}
                                            className={`w-40 px-2 py-1.5 border rounded focus:border-teal-400 outline-none text-left truncate transition-colors text-xs ${row.lecturer_id
                                                ? 'bg-white border-gray-200 text-gray-700'
                                                : 'bg-slate-50 border-dashed border-gray-300 text-gray-400'
                                                }`}
                                        >
                                            {row.lecturer_id ? (
                                                dosenList.find(d => d.id === row.lecturer_id)?.name ||
                                                dosenList.find(d => d.id === row.lecturer_id)?.nama ||
                                                'Dosen Terpilih'
                                            ) : (
                                                'Pilih Dosen...'
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-2 py-1 text-center">
                                        <button onClick={() => deleteRow(row.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Tip */}
                <div className="p-4 bg-blue-50 border-t border-blue-100 flex items-center gap-2 text-xs text-blue-700">
                    <Info size={16} />
                    <span>Tip: Klik <b>Kode Matkul</b> untuk memilih mata kuliah dari daftar master.</span>
                </div>
            </div>

            {/* Saved Schedules List */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">Daftar Jadwal Tersimpan</h2>
                    <p className="text-slate-500 text-sm">Data jadwal yang sudah berhasil disimpan ke database.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Hari / Jam / Ruang</th>
                                <th className="px-6 py-4">Kelas</th>
                                <th className="px-6 py-4">Mata Kuliah</th>
                                <th className="px-6 py-4">Dosen</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {savedSchedules.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400 italic">
                                        Belum ada jadwal tersimpan.
                                    </td>
                                </tr>
                            ) : (
                                savedSchedules.map((schedule) => (
                                    <tr key={schedule.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-700">{schedule.day}</div>
                                            <div className="text-xs text-slate-500">{schedule.start_time?.slice(0, 5)} - {schedule.end_time?.slice(0, 5)}</div>
                                            <div className="text-xs font-mono text-teal-600 bg-teal-50 inline-block px-1 rounded mt-1">{schedule.room}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{schedule.class_name}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-700">{schedule.courses?.name || '-'}</div>
                                            <div className="text-xs text-slate-500">{schedule.courses?.code}</div>
                                        </td>
                                        <td className="px-6 py-4">{schedule.lecturers?.name || '-'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleDeleteSchedule(schedule.id)}
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                title="Hapus Jadwal"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>

                <CoursePickerModal
                    isOpen={activeModal === 'course'}
                    onClose={() => setActiveModal(null)}
                    onSelect={handleSelectCourse}
                    courses={matkulList}
                />

                <LecturerPickerModal
                    isOpen={activeModal === 'lecturer'}
                    onClose={() => setActiveModal(null)}
                    onSelect={handleSelectLecturer}
                    lecturers={dosenList}
                />
            </div>
        </div>
    );
};

export default ModuleInputJadwal;
