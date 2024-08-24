import mysql from "mysql2/promise";
// import fs from "fs";

//env config
import dotenv from "dotenv";
dotenv.config();

//creating pool to handle multiple connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    ca: process.env.DB_CA,
    rejectUnauthorized: true,
  },
});

export default pool;
