const {setUser} = require('../service/auth');
const pool = require('../config');
const bcrypt = require('bcrypt'); // Import bcrypt


async function handleUserSignUp(req, res) {
    const { name, email, password } = req.body;

    try {
        // Check if the email already exists
        const [rows] = await pool.execute('SELECT email FROM loginDetails WHERE email = ?', [email]);

        if (rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

         // Hash the password before storing
         const saltRounds = 10;
         const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new user into the database
        await pool.execute(
            'INSERT INTO loginDetails (email, name, password) VALUES (?, ?, ?)',
            [email, name, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during user sign-up:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    try {
        // Check if the email exists in the database
        const [rows] = await pool.execute('SELECT * FROM loginDetails WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Email not found' });
        }

        // Compare the provided password with the password in the database
        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = await setUser(user);
        return res.json({token: token });

    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    handleUserSignUp, handleUserLogin
};