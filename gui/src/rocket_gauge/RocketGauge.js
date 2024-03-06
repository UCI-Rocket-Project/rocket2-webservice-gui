import React from "react";
import PropTypes from "prop-types";
import GaugeComponent from "react-gauge-component";
import styles from "./RocketGauge.module.css";

const RocketGauge = ({name, value = 0, minValue = 0, maxValue = 100, arc}) => {
    return (
        <div className={styles.box}>
            <h1 className={styles.title}>{name}</h1>
            <GaugeComponent
                className={styles.gauge} // Use className instead of class
                value={value}
                key={name}
                type="radial"
                arc={arc || {
                    colorArray: ["#5BE12C", "#EA4228"],
                    subArcs: [{limit: 10}, {limit: 30}, {}, {}, {}],
                    padding: 0.02,
                    width: 0.3
                }}
                pointer={{
                    elastic: false,
                    animationDelay: 0
                }}
                minValue={minValue}
                maxValue={maxValue}
            />
        </div>
    );
};

RocketGauge.propTypes = {
    name: PropTypes.string,
    value: PropTypes.number
};

export default RocketGauge;
