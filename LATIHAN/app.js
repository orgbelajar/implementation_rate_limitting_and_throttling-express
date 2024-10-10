const express = require('express');
const slowDown = require('express-slow-down'); // Import express-slow-down
const rateLimit = require('express-rate-limit'); // Import express-rate-limit

const app = express();
const port = 3000;

// Konfigurasi Rate Limiting untuk semua rute API
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // Jendela waktu 5 menit
  max: 15, // Maksimal 15 permintaan per IP dalam waktu 5 menit
  message: 'Terlalu banyak permintaan, coba lagi setelah beberapa saat.', // Pesan jika limit terlampaui
  standardHeaders: true, // Menambahkan header RateLimit-* ke response
  legacyHeaders: false, // Menonaktifkan X-RateLimit-* header
});

// Konfigurasi Throttling untuk semua rute API
const apiThrottle = slowDown({
  windowMs: 1 * 60 * 1000, // Jendela waktu 1 menit
  delayAfter: 5, // Tambah jeda setelah 5 permintaan dalam 1 menit
  delayMs: (used, req) => {
    const delayAfter = req.slowDown.limit;
    return (used - delayAfter) * 500; // Hitung jeda berdasarkan jumlah permintaan yang telah digunakan (Dinamis)
  },
});

// Terapkan Rate Limiting dan Throttling pada semua rute API yang dimulai dengan '/api/'
app.use('/api/', apiLimiter, apiThrottle);

// Rute utama (tanpa rate limit dan throttle)
app.get('/', (req, res) => {
  res.send('Selamat datang di API!');
});

// Contoh rute API yang dilindungi oleh Throttling dan rate Limiting
app.get('/api/test', (req, res) => {
  res.send('Rate limiting dan Throttling diterapkan di rute ini.');
});


// Konfigurasi Rate limiting khusus untuk rute login
const loginLimiter = rateLimit({
  windowMs: 8 * 60 * 1000, // Jendela waktu 8 menit
  max: 19, // Maksimal 19 percobaan login dalam 8 menit
  message: 'Terlalu banyak percobaan login, coba lagi setelah beberapa saat.', // Pesan khusus login
});

// Konfigurasi Throttling khusus untuk rute login
const loginThrottle = slowDown({
  windowMs: 1 * 60 * 1000, // Jendela waktu 1 menit
  delayAfter: 8, // Tambah jeda setelah 8 permintaan dalam 1 menit
  delayMs: (used, req) => {
    const delayAfter = req.slowDown.limit;
    return (used - delayAfter) * 500; // Hitung jeda berdasarkan jumlah permintaan yang telah digunakan (Dinamis)
  },
});

// Terapkan Rate Limiting dan Throttling khusus pada rute login
app.post('/login', loginLimiter, loginThrottle, (req, res) => {
  res.send('Percobaan login berhasil.');
});

// Jalankan server di port yang ditentukan
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
