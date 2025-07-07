import pool from "./config";

export default async function initializeConnection() {
  const connection = await pool.connect();

  const method = {
    get: async (query: string, params: any[] = []) => {
      try {
        const result = await connection.query(query, params);
        return result.rows;
      } catch (error) {
        console.error("Error executing GET:", error);
        throw error;
      } finally {
        connection.release();
      }
    },
    post: async (query: string, params: any[] = []) => {
      try {
        const result = await connection.query(query, params);
        return result.rowCount;
      } catch (error) {
        console.error("Error executing POST:", error);
        throw error;
      } finally {
        connection.release();
      }
    }
  };

  return method;
}
