import { envConfig } from "./src/config/config";
import app from "./src/app";
import categoryController from "./src/controller/categoryController";
import adminSeeder from "./src/adminSeeder";

function startServer() {
  const port = envConfig.port;
  app.listen(port, () => {
    categoryController.seedCategory();
    console.log(`Server is running on port ${port}`);
    adminSeeder();
  });
}

startServer();
