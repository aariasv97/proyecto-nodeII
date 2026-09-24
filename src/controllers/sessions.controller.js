import { registerUser } from "../services/sessions.service.js";

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
