import express from "express";
import eventsRouter from "./routes/events.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import passport from "./config/passport.config.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Servidor activo"
  });
});

app.use("/api/events", eventsRouter);
app.use("/api/sessions", sessionsRouter);

app.use(errorMiddleware);

export default app;
