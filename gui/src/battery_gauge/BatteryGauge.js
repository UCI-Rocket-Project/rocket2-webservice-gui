import React from "react";
import PropTypes from "prop-types";
import BatteryGauge from "react-battery-gauge";

const BatteryG = ({ val = 0, name }) => {
    return (
        <div>
            <h2>{name}</h2>
            <BatteryGauge
                value={val}
                orientation="horizontal"
                customization={{
                    batteryBody: {
                        strokeColor: 'silver',
                        strokeWidth: 1,
                        cornerRadius: 2,
                    },
                    batteryCap: {
                        strokeColor: 'silver',
                        cornerRadius: 1,
                        strokeWidth: 1,
                        capToBodyRatio: 0.3,
                    },
                    batteryMeter: {
                        outerGap: 1,
                        noOfCells: 10,
                    },
                    readingText: {
                        lightContrastColor: 'silver',
                        darkContrastColor: 'silver',
                        fontSize: 16,
                        style: { filter: 'url(#shadow)' },
                    },
                }}
            />
        </div>
    )
}


BatteryG.propTypes = {
    name: PropTypes.string,
    val: PropTypes.number
};

export default BatteryG;
