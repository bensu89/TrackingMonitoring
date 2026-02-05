# Sistem Informasi Monitoring Perkuliahan Terpadu

Sistem aplikasi web berbasis **React** dan **Supabase** untuk memantau kehadiran dosen secara *real-time*, memudahkan pelaporan mahasiswa, dan menyediakan dashboard administrasi bagi BAAK.

---

## 🚀 Fitur Utama

### 1. Dashboard Mahasiswa
Aplikasi "mobile-first" yang didesain seperti aplikasi native untuk kemudahan akses mahasiswa.
- **Smart Schedule**: Otomatis menampilkan jadwal kuliah yang sedang aktif berdasarkan hari dan jam saat ini.
- **Pelaporan Real-time**: Mencatat waktu **Masuk** dan **Keluar** dosen dengan presisi detik.
- **Status Kehadiran**: Melaporkan status dosen (Hadir / Tidak Hadir / Tugas).
- **History (Coming Soon)**: Riwayat kehadiran perkuliahan.

### 2. Live Monitoring Display
Tampilan layar penuh (Full Screen) yang diperuntukkan untuk layar TV / Monitor di lobi kampus.
- **Update Otomatis**: Data diperbarui secara *real-time* tanpa perlu refresh halaman (menggunakan Supabase Realtime).
- **Tracking Detail**: Menampilkan status kehadiran, jam masuk, dan jam keluar dosen.
- **Responsif**: Tabel monitoring otomatis menyesuaikan lebar layar.

### 3. Dashboard Admin (BAAK)
Panel administrasi untuk pengelolaan data akademik.
- **Manajemen Data Master**: Kelola data Dosen, Mata Kuliah, dan Mahasiswa.
- **Input Jadwal**: Form input jadwal dengan fitur deteksi konflik (bentrok ruangan/waktu).
- **Responsive Sidebar**: Menu navigasi yang fleksibel (bisa dibuka-tutup) untuk kenyamanan akses via Desktop maupun Mobile.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: [React.js](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Realtime)

---

## 📦 Cara Instalasi & Menjalankan Project

1.  **Clone Repository**
    ```bash
    git clone https://github.com/bensu89/TrackingMonitoring.git
    cd absensi-dosen
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Buat file `.env` dan isi dengan kredensial Supabase Anda:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Jalankan Development Server**
    ```bash
    npm run dev
    ```

5.  **Build untuk Production**
    ```bash
    npm run build
    ```

---

## 📝 Catatan Rilis Terakhir (v1.1)

- **[New]** Fitur pencatatan terpisah untuk Waktu Masuk & Waktu Keluar.
- **[New]** Tampilan Monitoring Table yang lebih luas (Full Screen).
- **[Update]** Sidebar Admin yang responsif (Hamburger Menu).
- **[Fix]** Perbaikan logika *Smart Schedule* pada dashboard mahasiswa.

---

© 2026 Pusat Data & Informasi Akademik - Fakultas Teknologi Informasi
