import express from "express";
import passport from "../config/passport.config.js";

import {
  createTicketController,
  getMyTicketsController,
  getEventTicketsController,
  cancelTicketController,
} from "../controllers/tickets.controller.js";

const router = express.Router();

router.post(
  "/events/:eid/tickets",
  passport.authenticate("current", { session: false }),
  createTicketController
);

router.get(
  "/tickets/my-tickets",
  passport.authenticate("current", { session: false }),
  getMyTicketsController
);

router.get(
  "/events/:eid/tickets",
  passport.authenticate("current", { session: false }),
  getEventTicketsController
);

router.patch(
  "/tickets/:tid/cancel",
  passport.authenticate("current", { session: false }),
  cancelTicketController
);

export default router;