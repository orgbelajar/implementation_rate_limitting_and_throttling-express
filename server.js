const express = require('express');

const app = express();

const port = 3000;

app.get('/', (req, res) => {
 res.send('Selamat Datang di API Awal');
});

app.listen(port, () => {
 console.log(`Server sedang berjalan on http://localhost:${port}`);
});