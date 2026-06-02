const db = require("../config/db");
const jwt = require("jsonwebtoken");

const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password required"
        });
    }

    const query = "SELECT * FROM users WHERE username = ?";

    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }
        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        const user = results[0];

        if (user.password != password) {
            return res.status(401).json({
                message: "Invaid Credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            token,
            role: user.role,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    });
};

const getProfile = (req, res) => {
    res.json({
        user: req.user
    });
};

module.exports = { login, getProfile };