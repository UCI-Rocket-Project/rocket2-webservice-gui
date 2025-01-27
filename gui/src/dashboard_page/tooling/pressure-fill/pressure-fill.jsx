import {useState, useContext} from "react";
import {ArrowUpward} from "@mui/icons-material";
import {RocketState} from "../../../Context";

export function PressureFill({running, setRunning}) {
    const {handleToggleState, isAborted} = useContext(RocketState);

    const [fillPsi, setFillPsi] = useState();
    const [inputValue, setInputValue] = useState();

    const valid = Number(inputValue) && inputValue >= 100 && inputValue <= 5000;

    const handleStart = () => {
        if (isAborted) {
            return;
        }

        setRunning(true);
        setFillPsi(inputValue);
        setInputValue(undefined);
        handleToggleState("gse", "Gn2Fill", true);
        return;
    };

    const handleChange = (e) => {
        setInputValue(e.currentTarget.value);
    };

    // https://stackoverflow.com/a/69497807
    const numberInputOnWheelPreventChange = (e) => {
        e.target.blur();
        setTimeout(() => {
            e.target.focus();
        }, 0);
    };

    return (
        <div
            style={{
                borderRadius: 10,
                padding: 12,
                fontSize: 24
            }}
        >
            <div>
                <h4
                    style={{
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                    }}
                >
                    <ArrowUpward /> <span>Automated Pressure Fill</span>
                </h4>

                <p style={{fontSize: 16, marginTop: 8, marginBottom: 8, padding: 0}}>
                    Input must be &gt;100 and &lt;5000.{" "}
                    <b>Any user input to controls will stop automated fill.</b>
                </p>
            </div>

            <div style={{display: "flex", gap: 8, width: "100%"}}>
                <input
                    value={inputValue}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    style={{margin: 0, width: 100, fontSize: 16, height: "fit-content"}}
                    onWheel={numberInputOnWheelPreventChange}
                />

                <button
                    style={{
                        cursor: "pointer",
                        fontSize: 16,
                        width: "100%"
                    }}
                    disabled={!valid || isAborted}
                    onClick={handleStart}
                >
                    Fill Up To Inputted Value
                </button>
            </div>

            {running ? (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <p
                        style={{
                            fontSize: 16,
                            marginTop: 8,
                            marginBottom: 8,
                            padding: 0,
                            textAlign: "center",
                            color: "red"
                        }}
                    >
                        Currently filling to <b>{fillPsi}</b> PSI
                    </p>
                </div>
            ) : null}
        </div>
    );
}
