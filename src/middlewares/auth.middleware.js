import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.currentUser;

    if (!token) {
      const error = new Error("Token requerido");
      error.status = 401;
      throw error;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;

    next();
  } catch (error) {
    const authError = new Error("Token inválido o expirado");
    authError.status = 401;
    next(authError);
  }
};