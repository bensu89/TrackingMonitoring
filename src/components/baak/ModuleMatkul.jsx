import React, { useState } from 'react';
import { BookMarked, PlusCircle, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const ModuleMatkul = ({ matkulList, setMatkulList }) => {
    const [newMatkul, setNewMatkul] = useState({ kode: '', nama: '', sks: '' });

    const handleMatkulInputChange = (e) => {
        const { name, value } = e.target;
        setNewMatkul(prev => ({ ...prev, [name]: value }));
    };

    const handleAddMatkul = async (e) => {
        e.preventDefault();

        try {
            console.log('Attempting to add course...', newMatkul);

            const payload = {
                code: newMatkul.kode.toUpperCase(), // Ensure uppercase code
                name: newMatkul.nama,
                sks_t: parseInt(newMatkul.sks) || 0,
                sks_p: 0,
                sks_pr: 0
            };

            const { data, error } = await supabase.from('courses').insert([payload]).select();

            if (error) {
                // If unique violation still happens, user hasn't run the SQL script
                if (error.code === '23505') {
                    throw new Error(`Kode "${payload.code}" duplikat. Anda belum menjalankan script SQL 'update_courses_constraint.sql' di Supabase untuk mengizinkan kode sama.`);
                }
                console.error('Supabase error:', error);
                throw error;
            }

            setMatkulList([...matkulList, ...data]);
            setNewMatkul({ kode: '', nama: '', sks: '' });
            alert('Mata Kuliah berhasil ditambahkan!');
        } catch (error) {
            console.error('Save error:', error);
            alert('Gagal: ' + error.message);
        }
    };

    const handleDeleteMatkul = async (id) => {
        if (!confirm('Hapus Mata Kuliah ini?')) return;

        try {
            const { error } = await supabase.from('courses').delete().eq('id', id);
            if (error) throw error;

            setMatkulList(matkulList.filter(m => m.id !== id));
        } catch (error) {
            alert('Gagal menghapus: ' + error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-emerald-50/50 p-6 border-b border-slate-100">
                    <div className="flex items-center space-x-3 text-emerald-700">
                        <BookMarked size={24} />
                        <h2 className="text-lg font-bold">Input Mata Kuliah Baru</h2>
                    </div>
                </div>
                <form onSubmit={handleAddMatkul} className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input name="kode" placeholder="Kode MK (e.g. IF101)" value={newMatkul.kode} onChange={handleMatkulInputChange} className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" required />
                    <input name="nama" placeholder="Nama Mata Kuliah" value={newMatkul.nama} onChange={handleMatkulInputChange} className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none md:col-span-2 focus:ring-2 focus:ring-emerald-500" required />
                    <input name="sks" type="number" min="1" max="6" placeholder="SKS" value={newMatkul.sks} onChange={handleMatkulInputChange} className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" required />
                    <div className="md:col-span-4 flex justify-end">
                        <button type="submit" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center space-x-2">
                            <PlusCircle size={20} />
                            <span>Tambah Mata Kuliah</span>
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800">Daftar Mata Kuliah</h2>
                    <div className="text-xs text-slate-400 font-mono">Total: {matkulList.length} MK</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Kode MK</th>
                                <th className="px-6 py-4">Nama Mata Kuliah</th>
                                <th className="px-6 py-4">SKS</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {matkulList.map((m) => (
                                <tr key={m.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm font-mono text-teal-600 font-bold">{m.code || m.kode}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">{m.name || m.nama}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{m.sks_t || m.sks} SKS</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleDeleteMatkul(m.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ModuleMatkul;
