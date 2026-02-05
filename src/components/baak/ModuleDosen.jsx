import React, { useState } from 'react';
import { UserPlus, PlusCircle, Search, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const ModuleDosen = ({ dosenList, setDosenList }) => {
    const [newDosen, setNewDosen] = useState({ nidn: '', nama: '', jabatan: '', homebase: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const handleDosenInputChange = (e) => {
        const { name, value } = e.target;
        setNewDosen(prev => ({ ...prev, [name]: value }));
    };

    const handleAddDosen = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                nidn: newDosen.nidn,
                name: newDosen.nama,
                jabatan: newDosen.jabatan,
                homebase: newDosen.homebase
            };

            const { data, error } = await supabase
                .from('lecturers')
                .insert([payload])
                .select();

            if (error) {
                if (error.code === '23505') {
                    throw new Error(`NIDN "${payload.nidn}" sudah terdaftar. Gunakan NIDN lain.`);
                }
                throw error;
            }

            if (data && data.length > 0) {
                // Add 'nama' property for local state consistency
                const newEntry = { ...data[0], nama: data[0].name };
                setDosenList([...dosenList, newEntry]);
                setNewDosen({ nidn: '', nama: '', jabatan: '', homebase: '' });
                alert('Dosen berhasil ditambahkan!');
            }

        } catch (error) {
            console.error("Add Dosen Error:", error);
            alert('Gagal menambah dosen: ' + error.message);
        }
    };

    const handleDeleteDosen = async (id) => {
        if (!confirm('Hapus data dosen ini?')) return;

        try {
            const { error } = await supabase.from('lecturers').delete().eq('id', id);

            if (error) throw error;

            setDosenList(dosenList.filter(d => d.id !== id));
        } catch (error) {
            alert('Gagal menghapus: ' + error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-emerald-50/50 p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-emerald-700">
                        <UserPlus size={24} />
                        <h2 className="text-lg font-bold">Input Data Dosen Baru</h2>
                    </div>
                </div>
                <form onSubmit={handleAddDosen} className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input name="nidn" placeholder="NIDN" value={newDosen.nidn} onChange={handleDosenInputChange} className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" required />
                    <input name="nama" placeholder="Nama Lengkap & Gelar" value={newDosen.nama} onChange={handleDosenInputChange} className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" required />
                    <select name="jabatan" value={newDosen.jabatan} onChange={handleDosenInputChange} className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" required>
                        <option value="">Jabatan Akademik</option>
                        <option value="Asisten Ahli">Asisten Ahli</option>
                        <option value="Lektor">Lektor</option>
                        <option value="Lektor Kepala">Lektor Kepala</option>
                        <option value="Guru Besar">Guru Besar</option>
                    </select>
                    <select name="homebase" value={newDosen.homebase} onChange={handleDosenInputChange} className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" required>
                        <option value="">Pilih Home Base</option>
                        <option value="Informatika">Informatika</option>
                        <option value="Sistem Informasi">Sistem Informasi</option>
                    </select>
                    <div className="md:col-span-4 flex justify-end">
                        <button type="submit" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center space-x-2">
                            <PlusCircle size={20} />
                            <span>Tambah Dosen</span>
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-slate-800">Daftar Dosen Terdaftar</h2>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Cari dosen..."
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-64 transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">NIDN</th>
                                <th className="px-6 py-4">Nama Dosen</th>
                                <th className="px-6 py-4">Jabatan</th>
                                <th className="px-6 py-4">Home Base</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {dosenList.filter(d => d.nama.toLowerCase().includes(searchTerm.toLowerCase())).map((dosen) => (
                                <tr key={dosen.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-teal-600">{dosen.nidn}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{dosen.nama}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{dosen.jabatan}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{dosen.homebase || '-'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleDeleteDosen(dosen.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors">
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

export default ModuleDosen;
