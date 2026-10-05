import User from "../models/User.js";

export const findUserByEmail = (email) => {
  return User.findOne({ email });
};

export const createUser = (userData) => {
  return User.create(userData);
};

export const findUserById = (userId) => {
  return User.findById(userId);
};