const express = require('express');
const rateLimit = require('express-rate-limit'); // Import express-rate-limit

const app = express();

const port = 3000;

// Konfigurasi Rate Limiting untuk semua rute API
const apiLimiter = rateLimit({
 windowMs: 5 * 60 * 1000, // Jendela waktu 15 menit
 max: 20, // Maksimal 20 permintaan per IP dalam 15 menit
 message: 'Terlalu banyak permintaan, coba lagi setelah 15 menit.', // Pesan jika limit terlampaui
 standardHeaders: true, // Menambahkan header RateLimit-* ke response
 legacyHeaders: false, // Menonaktifkan X-RateLimit-* header
});

// Terapkan Rate Limiting pada semua rute yang dimulai dengan '/api/'
app.use('/api/', apiLimiter);

// Rute utama (tanpa rate limit)
app.get('/', (req, res) => {
 res.send('Selamat datang di API!');
});

// Contoh rute API yang dilindungi oleh rate limiting
app.get('/api/test', (req, res) => {
    res.send('Rate limiting diterapkan pada rute ini.');
});



// Konfigurasi Rate Limiting khusus untuk rute login
const loginLimiter = rateLimit({
 windowMs: 5 * 60 * 1000, // Jendela waktu 5 menit
 max: 5, // Maksimal 5 percobaan login dalam 5 menit
 message: 'Terlalu banyak percobaan login, coba lagi setelah 5 menit.', // Pesan khusus login
});

// Terapkan Rate Limiting khusus pada rute login
app.post('/login', loginLimiter, (req, res) => {
 res.send('Percobaan login berhasil.');
});



// Jalankan server di port yang ditentukan
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
   });