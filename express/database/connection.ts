import pool from "./config";

export default async function initializeConnection() {
  const connection = await pool.connect();        
  // console.log("Database connection established");
  const method = {
    getUser: async (email?: string) => {
      try {
        if (email) {
          console.log("Fetching user by email:", email);
          const result = await connection.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
          );
          console.log("User result:", result);
          return result.rows;
        }
        const result = await connection.query("SELECT * FROM users");
        return result.rows;
      } catch (error) {
        console.error("Error executing GET:", error);
        throw error;
      } finally {
        connection.release(); // Uncomment if you want to release the connection after each query
      }
    },

    loginGet: async (
      query: string,
      user_id: number | string,
      params: any[] = [],
    ) => {
      console.log("Executing loginGet with user_id:", user_id);
      try {
        await connection.query("BEGIN");
        await connection.query(`SET app.current_user_id = '${user_id}'`);
        const result = await connection.query(query, params);
        await connection.query("COMMIT");
        return result.rows;
      } catch (error) {
        await connection.query("ROLLBACK");
        console.error("Error executing loginGet:", error);
        throw error;
      } finally {
        connection.release(); // Uncomment if you want to release the connection after each query
      }
    },

    post: async (
      user_id: string,
      title: string,
      description: string,
      amount: number | string
    ) => {
      try {
        await connection.query("BEGIN");
        await connection.query(`SET LOCAL app.current_user_id = '${user_id}'`);
        const result = await connection.query(
          "INSERT INTO reduce (user_id, title, description, amount) VALUES ($1, $2, $3, $4) RETURNING *",
          [user_id, title, description, amount]
        );
        await connection.query("COMMIT");
        console.log("Post result:", result);
        return result.rows[0]; // lebih berguna daripada rowCount
      } catch (error) {
        await connection.query("ROLLBACK");
        console.error("Error executing POST:", error);
        throw error;
      } finally {
        connection.release(); // Uncomment if you want to release the connection after each query
      }
    },
  };

  return {
    ...method,
    release: () => connection.release(),
  };
}
