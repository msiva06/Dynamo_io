import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./app/App";
import store from "./app/store";
import { BrowserRouter as Router } from "react-router-dom";

const root = createRoot(document.getElementById("app"));
root.render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
);
