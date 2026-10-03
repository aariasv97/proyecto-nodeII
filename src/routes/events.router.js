import { Router } from "express";
import passport from "../config/passport.config.js";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  updateEventStatus
} from "../controllers/events.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

const authenticate = passport.authenticate("current", {
  session: false
});

router.get("/", getEvents);

router.get("/:id", getEventById);

router.post(
  "/",
  authenticate,
  authorize("organizer", "admin"),
  createEvent
);

router.put(
  "/:id",
  authenticate,
  authorize("organizer", "admin"),
  updateEvent
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("organizer", "admin"),
  updateEventStatus
);

export default router;
