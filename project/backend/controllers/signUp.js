const {setUser} = require('../service/auth');
const pool = require('../config');
const bcrypt = require('bcrypt'); // Import bcrypt
const nodemailer = require('nodemailer');
require('dotenv').config();

// 📌 Function to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 📌 Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send OTP
const sendOTP = async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    try {
        // Hash the OTP before storing
        const hashedOTP = await bcrypt.hash(otp, 10);

        // Check if the user exists
        const [rows] = await pool.execute("SELECT email FROM loginDetails WHERE email = ?", [email]);

        if (rows.length > 0) {
            // If email exists, update OTP
            await pool.execute(
                "UPDATE loginDetails SET otp = ?, otp_expiry = ? WHERE email = ?",
                [hashedOTP, expiry, email]
            );
        } else {
            // If email does NOT exist, insert new user with OTP
            await pool.execute(
                "INSERT INTO loginDetails (email, otp, otp_expiry) VALUES (?, ?, ?)",
                [email, hashedOTP, expiry]
            );
        }

        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for Signup",
            text: `Your OTP is ${otp}. It will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Database error" });
    }
};

// Verify OTP
const verifyOTP = async (req, res) => {
    const { email, otp, password, name } = req.body;

    try {
        // Fetch OTP from DB
        const [rows] = await pool.execute("SELECT otp, otp_expiry FROM loginDetails WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(400).json({ message: "Email not found" });
        }

        const { otp: hashedOTP, otp_expiry } = rows[0];

        // Check if OTP is expired
        if (new Date(otp_expiry) < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        // Compare the entered OTP with stored hash
        const isOTPValid = await bcrypt.compare(otp, hashedOTP);
        if (!isOTPValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        await pool.execute(
            "UPDATE loginDetails SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?",
            [hashedPassword, email]
        );

        res.json({ message: "User verified and registered successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Database error" });
    }
};

// Forgot Password - Send OTP
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    try {
        // Hash the OTP before storing
        const hashedOTP = await bcrypt.hash(otp, 10);

        // Check if the user exists
        const [rows] = await pool.execute("SELECT email FROM loginDetails WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(400).json({ message: "Email not found" });
        }

        // Update the OTP and expiry time in the database
        await pool.execute(
            "UPDATE loginDetails SET otp = ?, otp_expiry = ? WHERE email = ?",
            [hashedOTP, expiry, email]
        );

        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent for password reset" });
    } catch (error) {
        console.error("Error sending OTP for password reset:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Fetch OTP from the database
        const [rows] = await pool.execute("SELECT otp, otp_expiry FROM loginDetails WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(400).json({ message: "Email not found" });
        }

        const { otp: hashedOTP, otp_expiry } = rows[0];

        // Check if OTP is expired
        if (new Date(otp_expiry) < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        // Compare the entered OTP with the stored hash
        const isOTPValid = await bcrypt.compare(otp, hashedOTP);
        if (!isOTPValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Hash the new password before updating
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        await pool.execute(
            "UPDATE loginDetails SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?",
            [hashedPassword, email]
        );

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

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
    handleUserSignUp, handleUserLogin,sendOTP,verifyOTP,forgotPassword,resetPassword
};