const { v4: uuidv4 } = require('uuid');
const {setUser,getUser} = require('../service/auth');
const pool = require('../config');
const { use } = require('../routes/user');

async function handleUserSignUp(req, res) {
    const { name, email, password } = req.body;

    try {
        // Check if the email already exists
        const [rows] = await pool.execute('SELECT email FROM loginDetails WHERE email = ?', [email]);

        if (rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Insert the new user into the database
        await pool.execute(
            'INSERT INTO loginDetails (email, name, password) VALUES (?, ?, ?)',
            [email, name, password]
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

        if (password !== user.password) {
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

  // try {
    //     // Check if the email exists in the database
    //     const [rows] = await pool.execute('SELECT * FROM loginDetails WHERE email = ?', [email]);

    //     if (rows.length === 0) {
    //         return res.status(400).json({ message: 'Email not found' });
    //     }

    //     // Compare the provided password with the hashed password in the database
    //     const user = rows[0];
    //     const passwordMatch = await bcrypt.compare(password, user.password);

    //     if (!passwordMatch) {
    //         return res.status(401).json({ message: 'Incorrect password' });
    //     }

    //     // User authentication successful
    //     res.status(200).json({ message: 'User authenticated successfully', user: user });
    // } catch (error) {
    //     console.error('Error during user login:', error);
    //     res.status(500).json({ message: 'Internal server error' });
    // }