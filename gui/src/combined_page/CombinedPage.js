import React from "react";
import {PlumbingPage} from "../plumbing_page/PlumbingPage";
import {TelemetryPage} from "../telemetry_page/TelemetryPage";

export function CombinedPage() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                height: "95vh",
                width: "100%",
                gap: "80px",
                boxSizing: "border-box"
            }}
        >
            <div
                style={{
                    minWidth: 600,
                    width: 600
                }}
            >
                <PlumbingPage />
            </div>
            <TelemetryPage />
        </div>
    );
}
