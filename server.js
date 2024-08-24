import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import pool from "./config/db.js";
import schoolRoutes from "./routes/schoolRoutes.js";

//REST object
const app = express();

//configure env
dotenv.config();

//middelwares
app.use(express.json());
app.use(morgan("dev"));

//routes
app.get("/", (req, res) => {
  res.status(200).send("<h1>......Server Running......</h1>");
});

app.use("/api", schoolRoutes);

//PORT
const PORT = process.env.PORT || 8080;

//connecting database and adding listener
pool
  .query("SELECT 1")
  .then(() => {
    console.log("..MySQL Database connected..");
    app.listen(PORT, () => {
      console.log(".......Server Running.......");
    });
  })
  .catch((error) => {
    console.log(error);
  });

