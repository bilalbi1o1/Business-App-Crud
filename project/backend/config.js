require('dotenv').config();  // Load .env variables

const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Default MySQL port
    waitForConnections: true,
    connectionLimit: 10, // Maximum number of connections
    queueLimit: 0
});

// Test the database connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Connected to MySQL Database");
        connection.release(); // Release the connection back to the pool
    } catch (error) {
        console.error("❌ MySQL Connection Error:", error.message);
    }
})();

module.exports = pool;
