import { defineConfig } from "vite";
import fs from "fs";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "cert/localhost-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "cert/localhost.pem")),
    },
    port: 5173,
    host: "localhost",
  },
});
