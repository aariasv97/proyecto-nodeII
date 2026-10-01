import { Router } from "express";
import {
  getSessions,
  register,
  login,
  current,
  logout,
  getAllUsers
} from "../controllers/sessions.controller.js";
import passport from "../config/passport.config.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get("/", getSessions);

router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  register
);

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  login
);

router.get(
  "/current",
  authMiddleware,
  current
);

router.get(
  "/users",
  authMiddleware,
  authorize("admin"),
  getAllUsers
);

router.post("/logout", logout);

export default router;
