const express = require("express");
const router = express.Router();

const {
    getAllEvents,
    createEvent,
    getEventById
} = require("../controllers/eventController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", authMiddleware, getAllEvents);

router.get("/:id", authMiddleware, getEventById);

router.post("/", authMiddleware, adminMiddleware, createEvent);

module.exports = router;