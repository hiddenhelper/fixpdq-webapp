// import { Logger } from "aws-amplify";
import logToCloudWatch from "./log-to-cloudwatch";
const logLevels = {
  development: "DEBUG",
  dev: "DEBUG",
  production: "ERROR",
  prod: "ERROR",
};
const logLevel = process.env.NODE_ENV
  ? logLevels[process.env.NODE_ENV]
  : "DEBUG"; // Can be set w/ Env Var
// console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
// const logger = new Logger("fixpdq-webapp", logLevel);

export default async function logHandler(message, type, data) {
  // if (type === "error") {
  //   logger.error(JSON.stringify({ message, data }));
  // } else if (type === "warn") {
  //   logger.warn(JSON.stringify({ message, data }));
  // } else if (type === "debug") {
  //   logger.debug(JSON.stringify({ message, data }));
  // } else {
  //   logger.info(JSON.stringify({ message, data }));
  // }

  logToCloudWatch(message, type, data);
}
