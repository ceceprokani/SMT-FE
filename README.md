# 📢 Sistem Otomatisasi Notifikasi Tugas PT. XYZ
Sistem ini dikembangkan untuk mengotomatisasi proses notifikasi tugas di lingkungan kerja PT. XYZ. Tujuannya adalah untuk mempermudah alur distribusi dan pelaporan tugas yang diberikan antar pegawai. Sistem berbasis web ini dilengkapi dengan berbagai fitur utama yang mendukung efektivitas kerja tim.

## 🚀 Fitur Utama  

**📝 Form Pengajuan Tugas**  
  Memungkinkan pemberi tugas untuk mengisi form digital yang otomatis masuk ke dalam daftar pekerjaan. Form ini dilengkapi dengan opsi:
  - Tingkat prioritas (tinggi, sedang, rendah)
  - Batas waktu penyelesaian
  Sehingga penerima tugas dapat mengetahui skala prioritas pengerjaan.

**📊 Laporan Tugas Bulanan**  
  Fitur ini memungkinkan pembuatan laporan bulanan berdasarkan tugas-tugas yang telah diselesaikan, guna memudahkan pemantauan dan evaluasi pekerjaan.

**🔔 Notifikasi Otomatis via Slack**  
  Fitur utama dari sistem ini adalah notifikasi real-time yang terintegrasi dengan aplikasi Slack melalui bot.  
  Notifikasi akan dikirimkan secara otomatis setiap kali:
  - Tugas baru diajukan
  - Tugas diselesaikan  
  Dengan demikian, baik pemberi maupun penerima tugas selalu mendapatkan pembaruan terbaru terkait status tugas mereka.

## 🛠️ Teknologi yang Digunakan  

- [Vue.js 3](https://vuejs.org/) - Framework utama untuk frontend.  
- [Vite](https://vitejs.dev/) - Build tool yang cepat dan modern untuk Vue.js.  
- [Vuex](https://vuex.vuejs.org/) - Untuk manajemen state aplikasi.  
- [Vue Router](https://router.vuejs.org/) - Untuk navigasi antar halaman.  
- [Axios](https://axios-http.com/) - Untuk komunikasi API backend.  
- [Bootstrap 5](https://getbootstrap.com/) - Untuk styling yang responsif.  

## 📦 Instalasi  

Pastikan Anda sudah menginstal **Node.js** dan **npm**.  

```sh
# Clone repositori
git clone https://github.com/ceceprokani/Sistem Management Task-Slack.git
cd Sistem Management Task-Slack

# Instal dependensi
npm install

# Jalankan aplikasi di mode pengembangan
npm run dev

# Bangun untuk produksi
npm run build