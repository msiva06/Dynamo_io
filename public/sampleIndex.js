import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { BrowserRouter as Router } from "react-router-dom";

const root = createRoot(document.getElementById("app"));
root.render(
  <Router>
    <App />
  </Router>
);
