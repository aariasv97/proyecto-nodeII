import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/database.js";
import { PORT } from "./config/env.js";


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor ejecutandose en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar con MongoDB:", error);
  });