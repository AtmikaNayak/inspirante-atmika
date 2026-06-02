const express = require("express");
const router = express.Router();

const {
    getAllEvents,
    createEvent,
    getEventById,
    getEventRegistrations
} = require("../controllers/eventController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get(
  "/:id/registrations",
  authMiddleware,
  adminMiddleware,
  getEventRegistrations
);

router.get("/", authMiddleware, getAllEvents);

router.get("/:id", authMiddleware, getEventById);

router.post("/", authMiddleware, adminMiddleware, createEvent);

module.exports = router;