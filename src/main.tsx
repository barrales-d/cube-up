import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Provider } from "jotai";
import { ReactUI } from "./react_components/ReactUI";
import { store } from "./store";

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("ui")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ReactUI />
    </Provider>
  </React.StrictMode>
);
