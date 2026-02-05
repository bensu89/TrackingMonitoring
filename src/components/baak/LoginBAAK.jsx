import React, { useState } from 'react';
import { Database, ChevronRight, ArrowLeft } from 'lucide-react';

import { supabase } from '../../lib/supabaseClient';

const LoginBAAK = ({ onLogin, onLogout }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false); // Toggle Login/Register

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (isRegister) {
            // REGISTER FLOW
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                alert('Registrasi Gagal: ' + error.message);
            } else {
                alert('Registrasi Berhasil! Silakan Login.');
                setIsRegister(false); // Switch back to login
            }
        } else {
            // LOGIN FLOW
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                alert('Login Gagal: ' + error.message);
            } else {
                // Check if user has admin role
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();

                if (profileError) {
                    console.error('Profile fetch error:', profileError);
                    alert('Gagal mengambil data profil: ' + profileError.message + '. Pastikan anda sudah menjalankan script database (schema.sql).');
                    await supabase.auth.signOut();
                } else if (profile?.role === 'admin') {
                    onLogin(data.user);
                } else {
                    alert('Akses Ditolak: Akun anda terdaftar sebagai "' + (profile?.role || 'none') + '", bukan "admin". Harap hubungi database administrator.');
                    await supabase.auth.signOut();
                }
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-emerald-500"></div>

                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-teal-100">
                        <Database size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{isRegister ? 'Registrasi Admin' : 'Admin BAAK'}</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Portal Administrasi Akademik</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">Email Administrator</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition-all font-semibold text-slate-700 focus:bg-white"
                            placeholder="admin@baak.ac.id"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition-all font-semibold text-slate-700 focus:bg-white"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        disabled={loading}
                        className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold uppercase tracking-wider shadow-lg hover:bg-teal-700 transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span>Memproses...</span>
                        ) : (
                            <>
                                <span>{isRegister ? 'Daftar Akun Baru' : 'Masuk Sistem'}</span>
                                <ChevronRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-teal-600 hover:text-teal-800 text-sm font-semibold underline"
                    >
                        {isRegister ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar Admin'}
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <button onClick={onLogout} className="text-slate-400 hover:text-slate-600 text-xs font-bold flex items-center justify-center mx-auto space-x-1 transition-colors">
                        <ArrowLeft size={14} />
                        <span>Kembali ke Beranda</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginBAAK;
