import React from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import "./globalStyles.css";
import {App} from "./App";
import {RocketTimestampsContextProvider} from "./rocket-timestamps/rocketTimestampsContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <RocketTimestampsContextProvider>
            <App />
        </RocketTimestampsContextProvider>
    </React.StrictMode>
);
