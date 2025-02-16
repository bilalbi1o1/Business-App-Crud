const pool = require('../config');

// Helper function to format date (YYYY-MM-DD)
const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

// Helper function to format datetime (YYYY-MM-DD HH:MM:SS)
const formatDateTime = (datetime) => {
    if (!datetime) return null;
    const d = new Date(datetime);
    return d.toISOString().slice(0, 19).replace("T", " ");  // Convert to MySQL DATETIME format
};

async function handleGetAllUsers(req, res) {
    try {
        const result = await pool.query("SELECT * FROM userDetails");

        const formattedResult = result[0].map(user => {
            return {
                ...user,
                date: formatDate(user.date),
                pickupTime: user.pickupTime,  // Time does not need formatting
                dateTime: formatDateTime(user.dateTime)
            };
        });

        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function handleGetUserByRef(req, res) {
    const userRef = req.params.ref;
    try {
        const result = await pool.query("SELECT * FROM userDetails WHERE ref = ?", [userRef]);

        if (result[0].length === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            const user = result[0][0];
            user.date = formatDate(user.date);
            user.pickupTime = user.pickupTime;  // Time remains unchanged
            user.dateTime = formatDateTime(user.dateTime);
            res.json(user);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function handleUpdateUserByRef(req, res) {
    const userRef = req.params.ref;
    const body = req.body;

    // ✅ Ensure dateTime is in correct format
    if (body.dateTime) {
        body.dateTime = formatDateTime(body.dateTime);
    }

    // ✅ Check and fix pickupTime before updating DB
    if (body.pickupTime) {
        const pickupDate = new Date(body.pickupTime);
        if (isNaN(pickupDate.getTime())) {
            return res.status(400).json({ status: "failed", message: "Invalid pickupTime format" });
        }
        body.pickupTime = pickupDate.toISOString().slice(0, 19).replace("T", " "); // Convert to MySQL DATETIME
    }

    try {
        // ✅ Ensure body is not empty
        if (Object.keys(body).length === 0) {
            return res.status(400).json({ status: "failed", message: "No update data provided" });
        }

        // ✅ Generate SET clause dynamically
        const fields = Object.keys(body).map(key => `${key} = ?`).join(', ');
        const values = Object.values(body);
        values.push(userRef); // Add userRef to the query params

        const query = `UPDATE userDetails SET ${fields} WHERE ref = ?`;

        // ✅ Debugging: Log query before execution
        console.log("Executing query:", query, values);

        // Execute query
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        return res.json({ status: "succeeded", message: "User information updated successfully" });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ status: "failed", error: error.message });
    }
}

async function handleDeleteUserByRef(req, res) {
    const userRef = req.params.ref;

    const query = `
        DELETE FROM userDetails
        WHERE ref = ?
    `;

    try {
        const result = await pool.query(query, userRef);

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        return res.json({ status: "succeeded", message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ status: "failed", error: error.message });
    }
}

async function handleCreateNewUser(req, res) {
    const body = req.body;
    const { date, firstName, lastName, email, cellNumber, phoneNumber, employeeName, pickupTime, remarks, product, issue, imei, notes, price, dateTime } = body;

    const query = `INSERT INTO userDetails 
        (firstName, lastName, date, product, issue, imei, price, email, cellNumber, 
         phoneNumber, employeeName, notes, remarks, pickupTime, dateTime) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [firstName, lastName, date, product, issue, imei, price, email, 
        cellNumber, phoneNumber, employeeName, notes, remarks, pickupTime, formatDateTime(dateTime)];

    try {
        const result = await pool.query(query, values);
        return res.json({ status: "succeeded", ref: result.insertId });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    handleGetAllUsers,
    handleGetUserByRef,
    handleUpdateUserByRef,
    handleDeleteUserByRef,
    handleCreateNewUser
};
