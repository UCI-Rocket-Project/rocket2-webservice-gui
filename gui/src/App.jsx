import {useEffect, useRef, useState, useCallback} from "react";
import {RocketState} from "./Context";
import {getEcuState, getGseState, getLoadCellState, updateRocket} from "./webservice";
import {DashboardPage} from "./dashboard_page/DashboardPage";
import {TelemetryPage} from "./telemetry_page/TelemetryPage";
import {DiagramPage} from "./diagram_page/DiagramPage";
import {AnalyticsPage} from "./analytics_page/AnalyticsPage";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Navbar} from "./Navbar";
import {useRocketTimestampsContext} from "./rocket-timestamps/rocketTimestampsContext";

export function App() {
    const [solenoids, setSolenoids] = useState({});
    const [tcs, setTcs] = useState({});
    const [pts, setPts] = useState({});
    const [igniters, setIgniters] = useState({});
    const [misc, setMisc] = useState({});
    const [isAborted, handleAbort] = useState(false);
    const [flight, setFlight] = useState({});
    const currentSolenoids = useRef();
    const currentTcs = useRef();
    const currentPts = useRef();
    const currentIgniters = useRef();
    const currentMisc = useRef();
    const hasInitialized = useRef(false); // if copv vent and gn2 fill are within the solenoids object

    const {updateTimestamps} = useRocketTimestampsContext();
    const currentFlight = useRef();

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
        currentFlight.current = flight;
    }, [flight]);
    useEffect(() => {
        currentMisc.current = misc;
    }, [misc]);

    const handleToggleState = (systemName, solenoidName, value) => {
        console.log("toggling state");
        console.log(systemName, solenoidName, value);
        updateRocket(systemName, solenoidName, value);
    };

    const parseState = useCallback(
        (state, timestamps) => {
            let solenoids = {};
            let pts = {};
            let tcs = {};
            let igniters = {};
            let flight = {};
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
                } else if (key.includes("altitude")) {
                    let key_name = key;
                    flight[key_name] = state[key];
                } else if (key.includes("acceleration")) {
                    let key_name = key;
                    flight[key_name] = state[key];
                } else {
                    misc[key] = state[key];
                }
            }

            setSolenoids({...currentSolenoids.current, ...solenoids});
            setTcs({...currentTcs.current, ...tcs});
            setPts({...currentPts.current, ...pts});
            setIgniters({...currentIgniters.current, ...igniters});
            setFlight({...currentFlight.current, ...flight});
            setMisc({...currentMisc.current, ...misc});

            // Update all of the timestamps
            for (let system in timestamps) {
                updateTimestamps(timestamps[system], system);
            }

            if (
                Object.keys({...currentSolenoids.current, ...solenoids}).indexOf("CopvVent") !==
                    -1 &&
                Object.keys({...currentSolenoids.current, ...solenoids}).indexOf("Gn2Fill") !== -1
            ) {
                hasInitialized.current = true;
            }
        },
        [updateTimestamps]
    );

    const fetchAndDispatchRocketState = useCallback(async () => {
        try {
            const ecuState = (await getEcuState()).data;
            const gseState = (await getGseState()).data;
            const loadCellState = (await getLoadCellState()).data;

            const timestamps = {
                ecu: ecuState.time_recv,
                gse: gseState.time_recv,
                load_cell: loadCellState.time_recv
            };
            parseState({...gseState, ...ecuState, ...loadCellState}, timestamps);
        } catch (error) {
            console.error("Error fetching rocket state:", error);
        }
    }, [parseState]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchAndDispatchRocketState();
        }, 250);

        return () => clearInterval(intervalId);
    }, [fetchAndDispatchRocketState]);

    return (
        <RocketState.Provider
            value={{
                solenoids,
                tcs,
                pts,
                igniters,
                misc,
                hasInitialized,
                handleToggleState,
                isAborted,
                handleAbort,
                flight
            }}
        >
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
        </RocketState.Provider>
    );
}
