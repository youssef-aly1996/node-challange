import { createServer } from "http";
import { config } from "dotenv";
import app from "./src/app.js";
config();

const port = process.env.APP_PORT || 5000;
const server = createServer(app);
server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
