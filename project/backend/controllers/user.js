const con = require('../config');

async function handleGetAllUsers(req, res) {
    con.query("SELECT * FROM userDetails", (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const formattedResult = result.map(user => {
            return {
                ...user,
                date: formatDate(user.date),
                pickupDate: formatDate(user.pickupDate)
            };
        });

        res.json(formattedResult);
    });
}

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


async function handleGetUserByRef(req, res) {
    const userRef = req.params.ref;
    con.query("SELECT * FROM userDetails WHERE ref = ?", [userRef], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (result.length === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json(result[0]);
        }
    });
}

async function handleUpdateUserByRef(req, res) {
    const userRef = req.params.ref;
    const body = req.body;
    console.log("This is the body",req.body);

    // Update the user's data in the database
    const query = `
        UPDATE userDetails
        SET ? 
        WHERE ref = ?
    `;

    con.query(query, [body, userRef], (err, result) => {
        if (err) {
            return res.status(500).json({ status: "failed", error: err.message });
        }

        if (result.affectedRows === 0) {
            // If no user was updated (user not found with the provided ref)
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        return res.json({ status: "succeeded", message: "User information updated successfully" });
    });
}

async function handleDeleteUserByRef(req, res) {
    const userRef = req.params.ref;

    // Delete the user from the database
    const query = `
        DELETE FROM userDetails
        WHERE ref = ?
    `;

    con.query(query, userRef, (err, result) => {
        if (err) {
            return res.status(500).json({ status: "failed", error: err.message });
        }

        if (result.affectedRows === 0) {
            // If no user was deleted (user not found with the provided ref)
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        return res.json({ status: "succeeded", message: "User deleted successfully" });
    });
}

async function handleCreateNewUser(req, res) {
    const body = req.body;
    const { ref, date, firstName, lastName, email, phoneCell, phoneHome, employeeName, pickupDate, remarks, product, issue, imeiSn, notes, price } = body;
    console.log(body);

    const query = `INSERT INTO userDetails (ref, date, firstName, lastName, email, phoneCell, phoneHome, employeeName,
        pickupDate, remarks, product, issue, imeiSn, notes, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [ref, date, firstName, lastName, email, phoneCell, phoneHome, employeeName, pickupDate, remarks, product, issue, imeiSn, notes, price];

    con.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.json({ status: "succeeded"});
    });
}

module.exports = {
    handleGetAllUsers, handleGetUserByRef, handleUpdateUserByRef, handleDeleteUserByRef, handleCreateNewUser
};