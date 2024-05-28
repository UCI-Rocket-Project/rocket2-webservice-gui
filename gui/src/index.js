import React from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {store} from "./redux/store";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import "./index.css";
import "./globalStyles.css";
import {DashboardPage} from "./dashboard_page/DashboardPage";
import {TelemetryPage} from "./telemetry_page/TelemetryPage";
import {DiagramPage} from "./diagram_page/DiagramPage";
import {AnalyticsPage} from "./analytics_page/AnalyticsPage";
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
setInterval(fetchAndDispatchRocketState, 250);

// Navbar Component
const Navbar = () => {
    return (
        <div>
            <button>
                <Link to="/">Dashboard</Link>
            </button>
            <button>
                <Link to="/rocket">Rocket</Link>
            </button>
            <button>
                <Link to="/telemetry">Telemetry</Link>
            </button>
            <button>
                <Link to="/analytics">Analytics</Link>
            </button>
        </div>
    );
};

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <Navbar />
                <Routes>
                    <Route
                        path="/"
                        element={<DashboardPage />}
                    />
                    <Route
                        path="/rocket"
                        element={<DiagramPage />}
                    />
                    <Route
                        path="/telemetry"
                        element={<TelemetryPage />}
                    />
                    <Route
                        path="/analytics"
                        element={<AnalyticsPage />}
                    />
                </Routes>
            </Router>
        </Provider>
    </React.StrictMode>
);
