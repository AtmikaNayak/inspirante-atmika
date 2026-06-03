const db = require("../config/db");

// GET ALL EVENTS
const getAllEvents = (req, res) => {
    const query = `
        SELECT 
            e.id,
            e.name,
            e.date,
            e.venue,
            e.capacity,
            COUNT(r.id) AS registeredCount
        FROM events e
        LEFT JOIN registrations r ON e.id = r.event_id
        GROUP BY e.id
        ORDER BY e.date ASC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }


        const events = results.map(event => {
            const percentage = (event.registeredCount / event.capacity) * 100;

            return {
                ...event,
                fillPercentage: percentage
            };
        });

        res.json(events);
    });
};

const createEvent = (req, res) => {
    const { name, date, venue, capacity } = req.body;

    if (!name || !date || !venue || !capacity) {
        return res.status(400).json({
            message: "All fields required!"
        });
    }

    if (capacity <= 0) {
        return res.status(400).json({
            message: "Capacity should be greater than 0!"
        });
    }

    const query = `
    INSERT INTO events (name, date, venue, capacity)
    VALUES (?, ?, ?, ?)
    `;

    db.query(query, [name, date, venue, capacity], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            message: "Event created successfully",
            eventId: result.insertId
        });
    });
};

const getEventById = (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT * FROM events WHERE id = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.json(results[0]);
    });
};

const getEventRegistrations = (req, res) => {
    const { id } = req.params;

    const query =
        `
            SELECT
                u.id,
                u.name,
                u.username,
                e.name AS eventName
            FROM registrations r
            JOIN users u
                ON r.user_id = u.id
            JOIN events e
                ON r.event_id = e.id
            WHERE e.id = ?
            ORDER BY u.name ASC
            `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });
};

module.exports = {
    getAllEvents,
    createEvent,
    getEventById,
    getEventRegistrations
};