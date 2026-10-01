import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { hashPassword } from "../utils/hash.js";

const SECRET_KEY = process.env.JWT_SECRET;

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const { first_name, last_name } = req.body;

        if (!first_name || !last_name || !email || !password) {
          return done(createError("Faltan campos obligatorios", 400));
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail.includes("@")) {
          return done(createError("Email inválido", 400));
        }

        if (password.length < 6) {
          return done(
            createError("La contraseña debe tener al menos 6 caracteres", 400)
          );
        }

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
          return done(createError("El email ya está registrado", 409));
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
          return done(createError("Credenciales inválidas", 401));
        }

        const passwordValid = await bcrypt.compare(
          password,
          user.password
        );

        if (!passwordValid) {
          return done(createError("Credenciales inválidas", 401));
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "current",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.currentUser || null,
      ]),
      secretOrKey: SECRET_KEY,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(null, false);
      }
    }
  )
);

export default passport;
