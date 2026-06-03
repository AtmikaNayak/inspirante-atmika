const db = require("../config/db");

const registerForEvent = (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    const { eventId } = req.body;

    if (role !== "student") {
        return res.status(403).json({
            message: "Only students can register"
        });
    }

    const eventQuery = "SELECT * FROM events WHERE id = ?";

    db.query(eventQuery, [eventId], (err, eventResult) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (eventResult.length === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        const event = eventResult[0];

        const countQuery = `
            SELECT COUNT(*) AS count 
            FROM registrations 
            WHERE event_id = ?
        `;

        db.query(countQuery, [eventId], (err, countResult) => {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }

            const registeredCount = countResult[0].count;

            if (registeredCount >= event.capacity) {
                return res.status(400).json({
                    message: "Event is full"
                });
            }

            const insertQuery = `
                INSERT INTO registrations (user_id, event_id)
                VALUES (?, ?)
            `;

            db.query(insertQuery, [userId, eventId], (err) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(400).json({
                            message: "Already registered for this event"
                        });
                    }

                    return res.status(500).json({
                        message: "Database error"
                    });
                }

                return res.json({
                    message: "Registration successful"
                });
            });
        });
    });
};

const getMyRegistrations = (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT 
            e.id,
            e.name,
            e.date,
            e.venue
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        WHERE r.user_id = ?
        ORDER BY e.date ASC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });
};

module.exports = {
    registerForEvent,
    getMyRegistrations
};