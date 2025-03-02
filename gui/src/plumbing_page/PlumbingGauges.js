import React from "react";

const PipeG = ({ width = 400, height = 10, pressure = 0, x = 0, y = 0, keys = [] }) => {
    let pressurized = false;
    let color = 'green';
    if (pressure > 0) {
        pressurized = true;
        color = 'red';
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
            <div>
                <div
                    style={{
                        position: 'absolute',
                        top: y,
                        left: x,
                        width,
                        height,
                        backgroundColor: color,
                    }}
                ></div>
            </div>
        </div>

    );
};

const ChamberG = ({ width = 150, height = 150, pressure = 0, x = 0, y = 0, name }) => {
    let pressurized = false;
    let color = 'green';
    if (pressure > 0) {
        pressurized = true;
        color = 'red';
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
            <div>
                <div
                    style={{
                        position: 'absolute',
                        top: y,
                        left: x,
                        width,
                        height,
                        backgroundColor: color,
                        borderRadius: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "15px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                    }}
                >
                    {name}
                    <br />
                    {pressure.toFixed(2)}
                </div>
            </div>
        </div>

    );
};

export { ChamberG, PipeG };
