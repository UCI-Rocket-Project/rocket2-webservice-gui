import React from "react";
import GaugeComponent from "react-gauge-component";
import styles from "./RocketGauge.module.css";

const RocketGauge = ({name, value, minValue, maxValue, units, width, arc}) => {
    return (
        <div style={{width: width ? width : "14%"}}>
            <GaugeComponent
                value={value}
                key={name}
                minValue={minValue ? minValue : 0}
                maxValue={maxValue ? maxValue : 10000}
                type="radial"
                arc={
                    arc
                        ? arc
                        : {
                              colorArray: ["#EA4228", "#5BE12C"],
                              subArcs: [{limit: 5000}, {}, {}],
                              padding: 0.02,
                              width: 0.3
                          }
                }
                labels={{
                    valueLabel: {
                        fontSize: 40,
                        formatTextValue: (value) => value + units
                    },
                    tickLabels: {
                        type: "outer",
                        valueConfig: {formatTextValue: (value) => value + units}
                    }
                }}
                pointer={{
                    elastic: false,
                    animationDelay: 0
                }}
            />
            <center>
                <h1 className={styles.title}>{name}</h1>
            </center>
        </div>
    );
};

export default RocketGauge;
