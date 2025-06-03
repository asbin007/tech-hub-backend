import { envConfig } from "./src/config/config";
import app from "./src/app";

function startServer() {
  const port = envConfig.port;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();
