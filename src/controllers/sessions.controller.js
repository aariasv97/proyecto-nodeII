import { signToken } from "../utils/jwt.js";
import { getAllUsersService } from "../services/users.service.js";
import { toUserDTO } from "../dtos/user.dto.js";

export const getSessions = (req, res) => {
  res.status(200).json({
    status: "success",
    payload: []
  });
};

export const register = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(201).json({
      status: "success",
      payload: toUserDTO(user)
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = req.user;

    const token = signToken({
      id: user._id ?? user.id,
      email: user.email,
      role: user.role
    });

    res.cookie("currentUser", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3600000,
      secure: process.env.NODE_ENV === "production"
    });

    res.status(200).json({
      status: "success",
      message: "Login correcto"
    });
  } catch (error) {
    next(error);
  }
};

export const current = (req, res) => {
  res.status(200).json({
    status: "success",
    payload: toUserDTO(req.user)
  });
};

export const logout = (req, res) => {
  res.clearCookie("currentUser");

  res.status(200).json({
    status: "success",
    message: "Logout correcto"
  });
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();

    res.status(200).json({
      status: "success",
      payload: users.map(toUserDTO)
    });
  } catch (error) {
    next(error);
  }
};
