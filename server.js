require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// 1. สร้างการเชื่อมต่อกับ MySQL
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

// 3. API สำหรับเพิ่มสินค้าใหม่ (POST) - รองรับทุกคอลัมน์ครบถ้วน
// API สำหรับเพิ่มสินค้าใหม่ (POST) - ป้องกัน Error 500 ด้วยการบันทึกเฉพาะฟิลด์หลัก
app.post('/api/products', async (req, res) => {
    try {
        const { name, stock, category, location, image, status, price, brand, sizes, productCode, orderName } = req.body;

        const sql = `
            INSERT INTO Inventory
            (name, stock, category, location, image, status, price, brand, sizes, productCode, orderName, lastUpdate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const values = [
            name,
            stock,
            category || 1,
            location || 'Main Warehouse',
            image || 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop',
            status || 'Active',
            price || null,
            brand || null,
            sizes || null,
            productCode || null,
            orderName || null
        ];

        const [result] = await pool.query(sql, values);
        
        res.status(201).json({ 
            message: 'เพิ่มสินค้าสำเร็จเรียบร้อย', 
            insertId: result.insertId 
        });
    } catch (err) {
        console.error('Insert Product Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// 3.1 API สำหรับดึงข้อมูลสินค้าชิ้นเดียว (GET by id) - ใช้เปิดหน้าแก้ไข
app.get('/api/products/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Inventory WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Get Product Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// 3.2 API สำหรับแก้ไขข้อมูลสินค้า (PUT)
app.put('/api/products/:id', async (req, res) => {
    try {
        const { name, stock, category, location, image, status, price, brand, sizes, productCode, orderName } = req.body;

        const sql = `
            UPDATE Inventory
            SET name = ?, stock = ?, category = ?, location = ?, image = ?, status = ?,
                price = ?, brand = ?, sizes = ?, productCode = ?, orderName = ?, lastUpdate = NOW()
            WHERE id = ?
        `;

        const values = [
            name,
            stock,
            category || 1,
            location || 'Main Warehouse',
            image || 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop',
            status || 'Active',
            price || null,
            brand || null,
            sizes || null,
            productCode || null,
            orderName || null,
            req.params.id
        ];

        const [result] = await pool.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'แก้ไขสินค้าสำเร็จเรียบร้อย' });
    } catch (err) {
        console.error('Update Product Error:', err.message);
        res.status(500).json({ error: err.message });
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