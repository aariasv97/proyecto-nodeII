import { getUserByEmail, saveUser } from "../repositories/users.repository.js";
import { hashPassword } from "../utils/hash.js";

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const registerUser = async ({
  first_name,
  last_name,
  email,
  password
}) => {
  if (
    !first_name?.trim() ||
    !last_name?.trim() ||
    !email?.trim() ||
    !password?.trim()
  ) {
    throw createError("Faltan campos obligatorios", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail.includes("@")) {
    throw createError("Email inválido", 400);
  }

  if (password.length < 6) {
    throw createError("La contraseña debe tener al menos 6 caracteres", 400);
  }

  const existingUser = await getUserByEmail(normalizedEmail);

  if (existingUser) {
    const error = new Error("El email ya está registrado");
    error.status = 409;
    throw error;
  }

  const passwordHash = await hashPassword(password);

  const newUser = await saveUser({
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    email: normalizedEmail,
    password: passwordHash
  });

  return {
    id: newUser._id,
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    email: newUser.email,
    role: newUser.role
  };
};