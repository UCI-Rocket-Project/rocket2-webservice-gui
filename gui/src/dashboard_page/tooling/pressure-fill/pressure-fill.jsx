import {useState} from "react";
import {ArrowUpward} from "@mui/icons-material";

export function PressureFill() {
    const [fillPsi, setFillPsi] = useState();

    const valid = Number(fillPsi) && fillPsi >= 100 && fillPsi <= 5000;

    const handleStart = () => {
        return;
    };

    const handleChange = (e) => {
        setFillPsi(e.currentTarget.value);
    };

    return (
        <div
            style={{
                borderRadius: 10,
                padding: 12,
                fontSize: 24
            }}
        >
            <h4
                style={{
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                }}
            >
                <ArrowUpward /> <span>Automated Pressure Decay</span>
            </h4>

            <div style={{display: "flex", gap: 8}}>
                <input
                    value={fillPsi}
                    onChange={handleChange}
                    style={{fontSize: 16, height: "fit-content"}}
                />

                <button
                    onClick={handleStart}
                    style={{
                        cursor: "pointer",
                        fontSize: 16,
                        width: "100%"
                    }}
                    disabled={!valid}
                >
                    Start Pressure Fill
                </button>
            </div>
        </div>
    );
}
