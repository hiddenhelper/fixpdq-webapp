import { API } from "aws-amplify";
import { getToken } from "../get-token";
import logHandler from "./log-handler";
import metricToCloudwatch from "./metric-to-cloudwatch";

export default async function loggedRequest(
  method,
  path,
  body,
  isEnabled = true
) {
  const token = await getToken();

  // Add correlation ID to request and log
  // Will need to add custom header to API Gateway

  const start = new Date();
  const x_correlation_id =
    "fixpdq_" + Math.floor(Math.random() * 9999999999) + 1000000000;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    // x_correlation_id,
  };

  if (method === "get") {
    return API.get("main", path, {
      headers,
    })
      .then((response) => {
        const data = {
          count: response.count,
          method,
          path,
          start,
          end: new Date(),
          x_correlation_id,
        };
        if (isEnabled) {
          logHandler("Successful " + method + " " + path, "info", data);
          metricToCloudwatch(
            "request-method",
            "request-time",
            "GET",
            new Date() - start,
            "Milliseconds"
          );
        }

        return response;
      })
      .catch((err) => {
        logHandler("Error with API Request", "error", err);
        metricToCloudwatch(
          "request-method",
          "request-error",
          "GET",
          1,
          "Count"
        );
        return err;
      });
  } else if (method === "post") {
    return API.post("main", path, {
      body,
      headers,
    })
      .then((response) => {
        const count = response.items ? response.items.length : "N/A";
        const data = {
          count,
          method,
          path,
          start,
          end: new Date(),
          x_correlation_id,
        };
        if (isEnabled) {
          logHandler("Successful " + method + " " + path, "info", data);
          metricToCloudwatch(
            "request-method",
            "request-time",
            "POST",
            new Date() - start,
            "Milliseconds"
          );
        }
        return response;
      })
      .catch((err) => {
        logHandler("Error with API Request", "error", err);
        metricToCloudwatch(
          "request-method",
          "request-error",
          "POST",
          1,
          "Count"
        );
        return err;
      });
  } else if (method === "put") {
    return API.put("main", path, {
      body,
      headers,
    })
      .then((response) => {
        const data = {
          response,
          method,
          path,
          start,
          end: new Date(),
          x_correlation_id,
        };
        if (isEnabled) {
          logHandler("Successful " + method + " " + path, "info", data);
          metricToCloudwatch(
            "request-method",
            "request-time",
            "PUT",
            new Date() - start,
            "Milliseconds"
          );
        }
        return response;
      })
      .catch((err) => {
        logHandler("Error with API Request", "error", err);
        metricToCloudwatch(
          "request-method",
          "request-error",
          "PUT",
          1,
          "Count"
        );
        return err;
      });
  } else if (method === "del") {
    return API.del("main", path, {
      body,
      headers,
    })
      .then((response) => {
        const data = {
          response,
          method,
          path,
          start,
          end: new Date(),
          x_correlation_id,
        };
        if (isEnabled) {
          logHandler("Successful " + method + " " + path, "info", data);
          metricToCloudwatch(
            "request-method",
            "request-time",
            "DEL",
            new Date() - start,
            "Milliseconds"
          );
        }
        return response;
      })
      .catch((err) => {
        logHandler("Error with API Request", "error", err);
        metricToCloudwatch(
          "request-method",
          "request-error",
          "DEL",
          1,
          "Count"
        );
        return err;
      });
  }
}
