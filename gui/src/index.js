import React from "react";
import {createRoot} from "react-dom/client";
import {App} from "./App";
import {RocketTimestampsContextProvider} from "./rocket-timestamps/rocketTimestampsContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <RocketTimestampsContextProvider>
        <App />
    </RocketTimestampsContextProvider>
);
