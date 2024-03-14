import React from "react";
import styles from "./ToggleButton.module.css";

const ToggleButton = ({name, className, feedback_value = 0, customClick = ()=>{}}) => {
    return feedback_value == 0 ? (
        <button
            className={`${className} ${styles.valveClose}`}
            onClick={()=>customClick(1)} // Turn on
        >
            Open {name}
        </button>
    ) : (
        <button
            className={`${className} ${styles.valveOpen}`}
            onClick={()=>customClick(0)} // Turn off
        >
            Closed {name}
        </button>
    );
};

export default ToggleButton;
