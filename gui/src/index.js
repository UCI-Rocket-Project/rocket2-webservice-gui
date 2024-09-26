import React from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import "./index.css";
import "./globalStyles.css";
import {DashboardPage} from "./dashboard_page/DashboardPage";
import {TelemetryPage} from "./telemetry_page/TelemetryPage";
import {DiagramPage} from "./diagram_page/DiagramPage";
import {AnalyticsPage} from "./analytics_page/AnalyticsPage";
import {RocketState} from "./Context";
import {useState} from "react";
import {App} from "./App";
const container = document.getElementById("root");
const root = createRoot(container);
// Function to fetch and update rocket state periodically

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
        <Router>
            <Navbar />
            <Routes>
                <Route
                    path="/"
                    element={<App />}
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
    </React.StrictMode>
);
