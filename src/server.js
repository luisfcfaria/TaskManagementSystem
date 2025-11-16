import { buildApp } from "./app.js";
const { environment } = await import("./environment/environment.js");

const app = buildApp();

try {
  await app.listen({ port: environment.server.port });
  app.log.info(`Server running on port ${environment.server.port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
