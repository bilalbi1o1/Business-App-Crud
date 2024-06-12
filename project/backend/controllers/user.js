const pool = require('../config');

// Helper function to format the date
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

async function handleGetAllUsers(req, res) {
    try {
        const result = await pool.query("SELECT * FROM userDetails");
        
        const formattedResult = result[0].map(user => {
            return {
                ...user,
                date: formatDate(user.date),
                pickupDate: formatDate(user.pickupDate)
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
            res.json(result[0][0]);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function handleUpdateUserByRef(req, res) {
    const userRef = req.params.ref;
    const body = req.body;

    // Update the user's data in the database
    const query = `
        UPDATE userDetails
        SET ? 
        WHERE ref = ?
    `;

    try {
        const result = await pool.query(query, [body, userRef]);
        
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        return res.json({ status: "succeeded", message: "User information updated successfully" });
    } catch (error) {
        return res.status(500).json({ status: "failed", error: error.message });
    }
}

async function handleDeleteUserByRef(req, res) {
    const userRef = req.params.ref;

    // Delete the user from the database
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
    const { ref, date, firstName, lastName, email, phoneCell, phoneHome, employeeName, pickupDate, remarks, product, issue, imeiSn, notes, price } = body;
    console.log(body);

    const query = `INSERT INTO userDetails (ref, date, firstName, lastName, email, phoneCell, phoneHome, employeeName,
        pickupDate, remarks, product, issue, imeiSn, notes, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [ref, date, firstName, lastName, email, phoneCell, phoneHome, employeeName, pickupDate, remarks, product, issue, imeiSn, notes, price];

    try {
        const result = await pool.query(query, values);
        return res.json({ status: "succeeded"});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    handleGetAllUsers, handleGetUserByRef, handleUpdateUserByRef, handleDeleteUserByRef, handleCreateNewUser
};
