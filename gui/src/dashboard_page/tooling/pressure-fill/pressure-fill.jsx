import {useState, useEffect, useCallback, useRef, useContext, useMemo} from "react";
import {ArrowUpward} from "@mui/icons-material";
import {RocketState} from "../../../Context";
import {useToolingContext} from "../tooling-context/tooling-context";

export function PressureFill() {
    const {pts, solenoids, handleToggleState, isAborted} = useContext(RocketState);
    const {
        fillPsi,
        setFillPsi,
        fillRunning: running,
        setFillRunning: setRunning,
        handleStopPressureFill: handleStop
    } = useToolingContext();

    const [inputValue, setInputValue] = useState();

    const valid = Number(inputValue) && inputValue >= 100 && inputValue <= 5000;
    const copvPt = pts.Copv;

    const handleStart = useCallback(() => {
        if (isAborted) {
            return;
        }

        if (copvPt >= fillPsi) {
            return;
        }

        setRunning(true);
        setFillPsi(inputValue);
        setInputValue("");
        handleToggleState("gse", "Gn2Fill", true);
    }, [copvPt, fillPsi, handleToggleState, inputValue, isAborted, setFillPsi, setRunning]);

    const handleChange = useCallback((e) => {
        setInputValue(e.currentTarget.value);
    }, []);

    // https://stackoverflow.com/a/69497807
    const numberInputOnWheelPreventChange = (e) => {
        e.target.blur();
        setTimeout(() => {
            e.target.focus();
        }, 0);
    };

    /**
     * Create a shallow copy of solenoids and filter out 'Gn2Fill'
     *
     * If any controls are triggered during automated fill, we will close Gn2Fill and "abort" automated fill
     */
    const filteredSolenoids = useMemo(() => {
        const newSolenoids = {...solenoids};
        delete newSolenoids.Gn2Fill;
        return newSolenoids;
    }, [solenoids]);

    const jsonSolenoids = JSON.stringify(filteredSolenoids);
    const prevJsonSolenoidsRef = useRef(jsonSolenoids);

    useEffect(() => {
        if (prevJsonSolenoidsRef.current !== jsonSolenoids) {
            console.log("Solenoids (other than Gn2Fill) changed:", jsonSolenoids);

            handleStop();
            prevJsonSolenoidsRef.current = jsonSolenoids;
        }
    }, [handleStop, jsonSolenoids]);

    useEffect(() => {
        if (copvPt >= fillPsi && running) {
            handleStop();
        }
    }, [copvPt, fillPsi, handleStop, running]);

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
