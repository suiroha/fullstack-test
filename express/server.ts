import dotenv from "dotenv";
import fs from "fs";
import https from "https";
dotenv.config();

import app from "./src/app";

const PORT = 3000;

const options = {
  key: fs.readFileSync('./cert/localhost-key.pem'),
  cert: fs.readFileSync('./cert/localhost.pem')
};

https.createServer(options, app).listen(3000, () => {
  console.log('🚀 Server HTTPS jalan di https://localhost:3000');
});

