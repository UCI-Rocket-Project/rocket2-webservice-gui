import React from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {store} from "./redux/store";
import App from "./App";
import "./index.css";
import {SolenoidPage} from "./solenoid_page/SolenoidPage";
import {fetchRocketState} from "./redux/rocketSlice";

const container = document.getElementById("root");
const root = createRoot(container);

// Function to fetch and update rocket state periodically
const fetchAndDispatchRocketState = async () => {
    try {
        // Dispatch the async thunk to fetch the rocket state
        await store.dispatch(fetchRocketState());
    } catch (error) {
        console.error("Error fetching rocket state:", error);
        // Handle errors if needed
    }
};

// Periodically fetch the rocket state every 1 second
setInterval(fetchAndDispatchRocketState, 1000);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <SolenoidPage />
            <App />
        </Provider>
    </React.StrictMode>
);
