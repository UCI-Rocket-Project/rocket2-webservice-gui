import React from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {store} from "./redux/store";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "./index.css";
import "./globalStyles.css";
import {SolenoidPage} from "./solenoid_page/SolenoidPage";
import {SensorPage} from "./sensor_page/SensorPage";
import {CombinedPage} from "./combined_page/CombinedPage";
import {fetchRocketState} from "./redux/rocketSlice";
import {TelemetryPage} from "./telemetry_page/TelemetryPage";

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
            <Router>
                <Routes>
                    <Route
                        path="/solenoids"
                        element={<SolenoidPage />}
                    />
                    <Route
                        path="/sensors"
                        element={<SensorPage />}
                    />
                    <Route
                        path="/telemetry"
                        element={<TelemetryPage />}
                        />
                    <Route 
                    path="/combined"
                    element={<CombinedPage />}
                />
                </Routes>
            </Router>
        </Provider>
    </React.StrictMode>
);
