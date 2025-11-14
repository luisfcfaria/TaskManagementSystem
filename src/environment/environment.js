import config from "config";

export const environment = {
  server: config.get("server"),
  logger: config.get("logger"),
};
