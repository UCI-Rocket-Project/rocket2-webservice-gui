import React from "react";
import {PlumbingPage} from "../plumbing_page/PlumbingPage";
import {TelemetryPage} from "../telemetry_page/TelemetryPage";

export function CombinedPage() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "between",
                height: "100vh",
                width: "100%",
                gap: "80px",
                boxSizing: "border-box"
            }}
        >
            <TelemetryPage />

            <div
                style={{
                    minWidth: 600,
                    width: 600,
                    overflow: "auto"
                }}
            >
                <PlumbingPage />
            </div>
        </div>
    );
}
