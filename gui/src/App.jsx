import {useEffect, useRef, useState} from "react";
import {RocketState} from "./Context";
import {DashboardPage} from "./dashboard_page/DashboardPage";
import {getEcuState, getGseState, updateRocket} from "./webservice";

export function App() {
    const [solenoids, setSolenoids] = useState({});
    const [tcs, setTcs] = useState({});
    const [pts, setPts] = useState({});
    const [igniters, setIgniters] = useState({});
    const [misc, setMisc] = useState({});
    const currentSolenoids = useRef();
    const currentTcs = useRef();
    const currentPts = useRef();
    const currentIgniters = useRef();
    const currentMisc = useRef();
    const [timestamp, setTimestamp] = useState();

    useEffect(() => {
        setInterval(fetchAndDispatchRocketState, 250);
    }, []);

    useEffect(() => {
        currentSolenoids.current = solenoids;
    }, [solenoids]);
    useEffect(() => {
        currentTcs.current = tcs;
    }, [tcs]);
    useEffect(() => {
        currentPts.current = pts;
    }, [pts]);
    useEffect(() => {
        currentIgniters.current = igniters;
    }, [igniters]);
    useEffect(() => {
        currentMisc.current = misc;
    }, [misc]);

    const handleToggleState = (systemName, solenoidName, value) => {
        console.log("toggling state");
        console.log(value);
        updateRocket(systemName, solenoidName, value);
    };

    const fetchAndDispatchRocketState = async () => {
        try {
            // Dispatch the async thunk to fetch the rocket state
            const ecuState = (await getEcuState()).data;
            let newEcuState = parseState(ecuState);
            const gseState = (await getGseState()).data;
            let newGseState = parseState(gseState);
        } catch (error) {
            console.error("Error fetching rocket state:", error);
            // Handle errors if needed
        }
    };

    function parseState(state) {
        let solenoids = {};
        let pts = {};
        let tcs = {};
        let igniters = {};
        let misc = {};
        for (const key in state) {
            if (key.includes("solenoid")) {
                let solenoidType = key.includes("Expected") ? "expected" : "current";
                let solenoidName = key.includes("Expected")
                    ? key.split("Expected")[1]
                    : key.split("Current")[1];
                if (!Object.keys(solenoids).includes(solenoidName)) {
                    solenoids[solenoidName] = {expected: 0, current: 0};
                }
                solenoids[solenoidName][solenoidType] = state[key];
            } else if (key.includes("temperature")) {
                let key_name = key.substring(11, key.length);
                tcs[key_name] = state[key];
            } else if (key.includes("pressure")) {
                let key_name = key.substring(8, key.length);
                pts[key_name] = state[key];
            } else if (key.includes("igniter")) {
                if (key.includes("Armed")) {
                    igniters.armed = state[key];
                } else {
                    let igniterType = key.includes("Expected") ? "expected" : "current";
                    let igniterName = key.includes("Expected")
                        ? key.split("Expected")[1]
                        : key.split("Current")[1];
                    if (!Object.keys(igniters).includes(igniterName)) {
                        igniters[igniterName] = {expected: 0, current: 0};
                    }
                    igniters[igniterName][igniterType] = state[key];
                }
            } else {
                misc[key] = state[key];
            }
        }
        setSolenoids({...currentSolenoids.current, ...solenoids});
        setTcs({...currentTcs.current, ...tcs});
        setPts({...currentPts.current, ...pts});
        setIgniters({...currentIgniters.current, ...igniters});
        setMisc({...currentMisc.current, ...misc});
        if (
            Object.keys({...currentSolenoids.current, ...solenoids}).indexOf("CopvVent") != -1 &&
            Object.keys({...currentSolenoids.current, ...solenoids}).indexOf("Gn2Fill") != -1
        ) {
            setTimestamp(1);
        }
    }

    return (
        <RocketState.Provider
            value={{
                solenoids,
                tcs,
                pts,
                igniters,
                misc,
                timestamp,
                handleToggleState
            }}
        >
            <DashboardPage></DashboardPage>
        </RocketState.Provider>
    );
}
