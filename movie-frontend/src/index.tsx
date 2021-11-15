/* eslint-disable import/first */
import { init as initApm } from "@elastic/apm-rum";
initApm({
  // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
  serviceName: "movie-frontend",
  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl:
    "https://84124e3c7d844cf09bdd3cd10a3a262a.apm.us-central1.gcp.cloud.es.io:443",

  // Set service version (required for sourcemap feature)
  serviceVersion: "1.0",
  breakdownMetrics: true,
  disableInstrumentations: ["eventtarget"],
  logLevel: "debug",
});

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
