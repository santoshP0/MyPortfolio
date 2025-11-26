/**
 * @file This is the entry point of the React application.
 * It uses the `createRoot` API from `react-dom/client` to render the main `App`
 * component into the DOM element with the `id` of "root". The application is
 * wrapped in `React.StrictMode` to enable additional checks and warnings for
 * potential problems in development mode.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
