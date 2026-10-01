import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
app.use(cors()); // izinkan akses dari aplikasi mobile
app.use(express.json()); // baca body berformat JSON

app.get('/api/pengeluaran', (req, res) => {
    
res.send('API Pengeluaran berjalan');
});
const PORT = 3000;
app.listen(PORT, () => {
console.log(`Server berjalan di http://localhost:${PORT}`);
});


// pool sudah diimpor dari './db.js' pada Langkah 11
// gunakan const app = express() yang sudah ada sejak Langkah 3
app.get("/pengeluaran", async (req, res) => {
  try {
    const query = `
      SELECT p.id, p.judul, p.nominal, p.tanggal,
k.nama AS kategori
FROM pengeluaran p
LEFT JOIN kategori k ON p.id_kategori = k.id
ORDER BY p.id DESC
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ pesan: "Gagal mengambil data pengeluaran" });
  }
});


// Endpoint untuk mengambil semua daftar kategori dari database
app.get('/kategori', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM kategori ORDER BY nama DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching kategori:', error);
    res.status(500).json({ pesan: 'Gagal mengambil data kategori' });
  }
});

// Endpoint mengambil detail 1 pengeluaran berdasarkan ID
app.get("/pengeluaran/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        p.*, 
        k.nama AS nama_kategori,
        k.nama AS kategori
      FROM pengeluaran p
      LEFT JOIN kategori k ON p.id_kategori = k.id 
      WHERE p.id = ?
    `;
    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ pesan: "Data pengeluaran tidak ditemukan" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching detail:", error);
    res.status(500).json({ pesan: "Gagal mengambil detail data" });
  }
});


//post
app.post("/pengeluaran", async (req, res) => {
  try {
    const { judul, nominal, id_kategori, catatan } = req.body;

    const query = `
      INSERT INTO pengeluaran (judul, nominal, id_kategori, catatan)
      VALUES (?, ?, ?, ?)
    `;

    await pool.query(query, [judul, nominal, id_kategori, catatan || ""]);
    res.status(201).json({ pesan: "Pengeluaran berhasil disimpan" });
  } catch (error) {
    console.error("Error insert pengeluaran:", error);
    res.status(500).json({ pesan: "Gagal menyimpan pengeluaran" });
  }
});


//put

// Endpoint PUT untuk memperbarui Judul, Nominal, & Catatan
app.put('/pengeluaran/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, nominal, catatan } = req.body;

    if (!judul || !nominal) {
      return res.status(400).json({ pesan: 'Judul dan nominal wajib diisi' });
    }

    const query = `
      UPDATE pengeluaran 
      SET judul = ?, nominal = ?, catatan = ? 
      WHERE id = ?
    `;

    const [result] = await pool.query(query, [judul, nominal, catatan || '', id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ pesan: 'Data pengeluaran tidak ditemukan' });
    }

    res.json({ pesan: 'Data pengeluaran berhasil diperbarui' });
  } catch (error) {
    console.error('Error update pengeluaran:', error);
    res.status(500).json({ pesan: 'Gagal memperbarui data pengeluaran' });
  }
});


//delete
app.delete('/pengeluaran/:id', async (req, res) => {
const [hasil] = await pool.query(
'DELETE FROM pengeluaran WHERE id = ?', [req.params.id]
);
if (hasil.affectedRows === 0) {
return res.status(404).json({ pesan: 'Data tidak ditemukan' });
}
res.status(204).end();
});



