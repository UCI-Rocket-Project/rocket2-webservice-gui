import React from "react";
import PropTypes from "prop-types";
import GaugeComponent from "react-gauge-component";
import styles from "./RocketGauge.module.css";

const RocketGauge = ({name, value}) => {
    return (
        <div>
            <h1>{name}</h1>
            <GaugeComponent
                className={styles.gauge} // Use className instead of class
                value={value}
                key={name}
                type="radial"
                labels={{
                    tickLabels: {
                        type: "inner",
                        ticks: [{value: 20}, {value: 40}, {value: 60}, {value: 80}, {value: 100}]
                    }
                }}
                arc={{
                    colorArray: ["#5BE12C", "#EA4228"],
                    subArcs: [{limit: 10}, {limit: 30}, {}, {}, {}],
                    padding: 0.02,
                    width: 0.3
                }}
                pointer={{
                    elastic: false,
                    animationDelay: 0
                }}
            />
        </div>
    );
};

RocketGauge.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
};

export default RocketGauge;
