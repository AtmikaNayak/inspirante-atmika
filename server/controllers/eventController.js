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

        // add derived field: fill percentage
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

const createEvent = (req, res) =>{
    const { name, date, venue, capacity} = req.body;

    if(!name || !date || !venue || !capacity){
        return res.status(400).json({
            messag : "All fileds required!"
        });
    }

    const query = `
    INSERT INTO events (name, date, venue, capacity)
    VALUES (?, ?, ?, ?)
    `;

    db.query(query, [name, date, event, capacity], (err,result) => {
        if(err){
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            message: "Event created successfully",
            eventId:result.insertId
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

module.exports = {
    getAllEvents,
    createEvent,
    getEventById
};