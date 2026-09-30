import { registerUser, loginUser } from "../services/sessions.service.js";

export const getSessions = (req, res) => {
  res.status(200).json({
    status: "success",
    payload: []
  });
};

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      status: "success",
      payload: user
    });
  } catch (error) {    
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    res.cookie("currentUser", result.token, {
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
    payload: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
};

export const logout = (req, res) => {
  res.clearCookie("currentUser");

  res.status(200).json({
    status: "success",
    message: "Logout correcto"
  });
};