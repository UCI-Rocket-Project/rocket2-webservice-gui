import styles from "./tooling.module.css";

import {PressureDecay} from "./pressure-decay/pressure-decay";
import {PressureFill} from "./pressure-fill/pressure-fill";

function ArrowIcon(props) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="currentColor"
            height="50px"
            width="50px"
            {...props}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={5}
                d="M15 24l17 17 17-17"
            />
        </svg>
    );
}

export function Tooling() {
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
                        <PressureDecay />

                        <PressureFill />
                    </div>
                </div>
            </div>

            <div style={{width: "100%", height: 50, fontSize: 30, textAlign: "center"}}>
                <ArrowIcon />

                <div />
            </div>
        </div>
    );
}
