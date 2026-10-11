export const errorMiddleware = (error, req, res, next) => {
  let status = error.status || 500;
  let message = error.message || "Error interno del servidor";

  if (error.name === "ValidationError" || error.name === "CastError") {
    status = 400;
    message = "Los datos enviados no son válidos";
  }

  if (error.code === 11000) {
    status = 409;
    message = "Ya existe un registro con esos datos";
  }

  res.status(status).json({
    status: "error",
    message
  });
};
