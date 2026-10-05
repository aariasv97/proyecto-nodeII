import {
  findUserByEmail,
  createUser,
  findUserById,
} from "../dao/users.dao.js";

export const getUserByEmail = (email) => {
  return findUserByEmail(email);
};

export const saveUser = (userData) => {
  return createUser(userData);
};

export const getUserById = (userId) => {
  return findUserById(userId);
};