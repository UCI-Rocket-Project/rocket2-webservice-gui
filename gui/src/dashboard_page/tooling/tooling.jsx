import styles from "./tooling.module.css";
import {ArrowDownward, ArrowUpward, ExpandMore} from "@mui/icons-material";
import {useState} from "react";
import {PressureDecay} from "./pressure-decay/pressure-decay";
import {PressureFill} from "./pressure-fill/pressure-fill";
import {useToolingContext} from "./tooling-context/tooling-context";

export function Tooling() {
    const {fillRunning} = useToolingContext();
    const [decayRunning, setDecayRunning] = useState(false);

    return (
        <div className={styles.dropdown}>
            <div className={styles.dropdownContent}>
                <div className={styles.tooling}>
                    <h2 className={styles.title}>Tooling</h2>
                    <div
                        className={styles.toolingBoundingBox}
                        style={{
                            paddingLeft: 12,
                            paddingRight: 12,
                            display: "flex",
                            flexDirection: "column",
                            gap: 16
                        }}
                    >
                        <PressureDecay
                            running={decayRunning}
                            setRunning={setDecayRunning}
                        />

                        <PressureFill />
                    </div>
                </div>
            </div>

            <div
                style={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 50
                }}
            >
                <ExpandMore style={{width: 36, height: 36, aspectRatio: 1 / 1}} />

                <div
                    style={{
                        position: "absolute",
                        right: 16,
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        gap: 4
                    }}
                >
                    {decayRunning ? <ArrowDownward style={{color: "aqua"}} /> : null}
                    {fillRunning ? <ArrowUpward style={{color: "red"}} /> : null}
                </div>
            </div>
        </div>
    );
}
