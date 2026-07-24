require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// 1. สร้างการเชื่อมต่อกับ MySQL (ใช้โค้ดตัวเต็ม ไม่ใช่จุดสามจุดแล้วครับ)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+07:00'
});

// 2. API สำหรับดึงข้อมูลสินค้าทั้งหมด (GET)
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Inventory ORDER BY lastUpdate DESC');
        res.json(rows);
    } catch (err) {
        console.error('Products Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// 3. API สำหรับเพิ่มสินค้าใหม่ (POST)
app.post('/api/products', async (req, res) => {
    try {
        const { name, stock, category, location, image, status } = req.body;
        const sql = `
            INSERT INTO Inventory 
            (name, stock, category, location, image, status, lastUpdate) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        const values = [name, stock, category, location, image, status];
        const [result] = await pool.query(sql, values);
        res.status(201).json({ 
            message: 'เพิ่มสินค้าสำเร็จเรียบร้อย', 
            insertId: result.insertId 
        });
    } catch (err) {
        console.error('Insert Product Error:', err.message);
        res.status(500).json({ error: 'ไม่สามารถเพิ่มสินค้าได้' });
    }
});

// 4. API ตรวจสอบสถานะเซิร์ฟเวอร์
app.get('/api', (req, res) => {
    res.send('API is running');
});

// 5. สั่งให้เซิร์ฟเวอร์เริ่มทำงาน
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 API running on port ${port}`);
});