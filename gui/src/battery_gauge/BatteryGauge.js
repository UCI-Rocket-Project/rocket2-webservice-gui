import React from "react";

const BatteryG = ({ val = 0, max = 100, width = 400, height = 200, color = 'green' }) => {
    const fillWidth = (val / max) * width;
    console.log(val);
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
            <div
                style={{
                    position: 'relative',
                    width: width + 8,
                    height,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {/*fill */}
                <div
                    style={{
                        width: fillWidth,
                        height: '100%',
                        backgroundColor: color,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease-in-out',
                        zIndex: 0,
                    }}
                ></div>

                {/* border */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: '10px solid silver',
                        boxSizing: 'border-box',
                        zIndex: 1,
                    }}
                ></div>
                {/* text */}
                <div
                    style={{
                        position: "absolute",
                        top: '50%',
                        left: '50%', 
                        transform: 'translate(-50%, -50%)',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "26px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "bold",
                    }}
                >
                    {val.toFixed(2)}
                </div>
            </div>


            {/* cap */}
            <div
                style={{
                    width: '10px',
                    height: height / 2,
                    backgroundColor: 'silver',
                }}
            ></div>
        </div>

    );
};


export default BatteryG;
