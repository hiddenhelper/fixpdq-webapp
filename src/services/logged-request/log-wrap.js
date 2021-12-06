import { getToken } from "./get-token";
import logHandler from "./log-handler";

export default async function logWrap(func, message) {
  const commonBody = {
    token: getToken(),
  };

  const start = new Date();

  const result = await func();

  const end = new Date();

  logHandler(message, "info", { start, end, result });
}
