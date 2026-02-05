import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { User, Lock, GraduationCap, ChevronLeft, Mail, IdCard } from 'lucide-react';

const LoginMhs = ({ onBack }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [nim, setNim] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isRegister) {
                // REGISTRATION LOGIC
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            role: 'mahasiswa',
                            nip_nim: nim
                        }
                    }
                });

                if (error) throw error;

                alert('Registrasi berhasil! Silakan login dengan akun baru Anda.');
                setIsRegister(false); // Switch back to login
            } else {
                // LOGIN LOGIC
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                // Optional: Check role if strict
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
                if (profile?.role !== 'mahasiswa' && profile?.role !== 'admin') {
                    alert('Peringatan: Akun ini bukan akun Mahasiswa (' + (profile?.role || 'unknown') + ')');
                }
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
            <div className="w-full max-w-sm space-y-8">
                {/* Logo Area */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl mb-4 text-white hover:scale-105 transition-transform duration-300">
                        <GraduationCap size={48} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight text-center uppercase">
                        Portal Mahasiswa
                    </h2>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <h3 className="text-center font-bold text-slate-700 mb-6 text-lg tracking-wide uppercase">
                        {isRegister ? 'Registrasi Akun Baru' : 'Silahkan Login'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isRegister && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                    <div className="relative group">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                                            <User size={20} />
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Nama Lengkap"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-teal-500 focus:bg-white outline-none transition-all font-semibold text-slate-700"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">NIM / NPM</label>
                                    <div className="relative group">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                                            <IdCard size={20} />
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Nomor Induk Mahasiswa"
                                            value={nim}
                                            onChange={(e) => setNim(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-teal-500 focus:bg-white outline-none transition-all font-semibold text-slate-700"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Mahasiswa</label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                                    <Mail size={20} />
                                </span>
                                <input
                                    type="email"
                                    placeholder="mahasiswa@univ.ac.id"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-teal-500 focus:bg-white outline-none transition-all font-semibold text-slate-700"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                                    <Lock size={20} />
                                </span>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-teal-500 focus:bg-white outline-none transition-all font-semibold text-slate-700"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-teal-700 hover:shadow-teal-500/30 transition-all active:scale-95 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Memproses...' : (isRegister ? 'Daftar Sekarang' : 'Masuk')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            {isRegister ? 'Sudah punya akun? ' : 'Belum punya akun? '}
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                className="text-teal-600 font-bold hover:underline"
                            >
                                {isRegister ? 'Login di sini' : 'Daftar di sini'}
                            </button>
                        </p>
                    </div>
                </div>

                <button
                    onClick={onBack}
                    className="w-full py-3 bg-transparent text-slate-500 font-bold text-sm hover:text-teal-600 transition flex items-center justify-center space-x-2"
                >
                    <ChevronLeft size={16} />
                    <span>Kembali ke Monitoring</span>
                </button>

                <p className="text-center text-slate-400 text-xs mt-8 font-medium">
                    © 2026 Sistem Pelaporan Akademik
                </p>
            </div>
        </div>
    );
};

export default LoginMhs;
