import React from "react";
import { createRoot } from "react-dom/client"; // Updated import
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import "./index.css";
import { MessageProvider } from "./components/common/Message";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MessageProvider>
        <App />
      </MessageProvider>
    </Provider>
  </React.StrictMode>
);
