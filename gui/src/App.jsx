import {useEffect, useRef, useState} from "react";
import {RocketState} from "./Context";
import {getEcuState, getGseState, updateRocket} from "./webservice";
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
    const currentSolenoids = useRef();
    const currentTcs = useRef();
    const currentPts = useRef();
    const currentIgniters = useRef();
    const currentMisc = useRef();
    const hasInitialized = useRef(false); // if copv vent and gn2 fill are within the solenoids object

    const {updateTimestamps} = useRocketTimestampsContext();

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
        console.log(systemName, solenoidName, value);
        updateRocket(systemName, solenoidName, value);
    };

    const fetchAndDispatchRocketState = async () => {
        try {
            const ecuState = (await getEcuState()).data;
            parseState(ecuState, "ecu");
            const gseState = (await getGseState()).data;
            parseState(gseState, "gse");
        } catch (error) {
            console.error("Error fetching rocket state:", error);
        }
    };

    function parseState(state, system) {
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

        const timeRecv = state.time_recv;
        updateTimestamps(timeRecv, system);

        if (
            Object.keys({...currentSolenoids.current, ...solenoids}).indexOf("CopvVent") != -1 &&
            Object.keys({...currentSolenoids.current, ...solenoids}).indexOf("Gn2Fill") != -1
        ) {
            hasInitialized.current = true;
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
                hasInitialized,
                handleToggleState,
                isAborted,
                handleAbort
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
