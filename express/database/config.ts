import { Pool } from "pg";

const config = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "password",
  database: process.env.DB_NAME || "mydatabase",
};
// console.log(config)
let pool: Pool;

try {
  pool = new Pool(config);
} catch (error) {
  console.error("Error creating database pool:", error);
  throw error;
}

export default pool;


