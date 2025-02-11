import {useState, useCallback, useContext} from "react";
import {RocketState} from "../../../Context";

export function useTooling() {
    const {handleToggleState} = useContext(RocketState);

    const [fillRunning, setFillRunning] = useState(false);
    const [fillPsi, setFillPsi] = useState();

    const handleStopPressureFill = useCallback(() => {
        console.log("hit");

        // If we're not running, this is a no-op
        if (!fillRunning) {
            return;
        }

        setFillRunning(false);
        setFillPsi(undefined);
        handleToggleState("gse", "Gn2Fill", false);
    }, [handleToggleState, fillRunning]);

    return {
        fillRunning,
        setFillRunning,
        fillPsi,
        setFillPsi,
        handleStopPressureFill
    };
}
