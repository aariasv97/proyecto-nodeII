import { findUserByEmail, createUser } from "../dao/users.dao.js";

export const getUserByEmail = (email) => {
  return findUserByEmail(email);
};

export const saveUser = (userData) => {
  return createUser(userData);
};