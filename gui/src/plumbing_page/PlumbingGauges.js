import React from "react";
let color = "green";
const PipeG = ({
    width = 15,
    height = 15,
    pressurized = 0,
    x = 0,
    y = 0,
    topBorder = true,
    bottomBorder = true,
    leftBorder = true,
    rightBorder = true
}) => {
    let color = "green";
    const BORDER_SIZE = 3;
    if (pressurized) {
        color = "red";
    }
    return (
        <div style={{display: "flex", alignItems: "center", gap: "8px", position: "relative"}}>
            <div>
                <div
                    style={{
                        position: "absolute",
                        top: y,
                        left: x,
                        width,
                        height,
                        backgroundColor: color
                    }}
                ></div>
                {leftBorder == true ? (
                    <div
                        style={{
                            position: "absolute",
                            top: y,
                            left: x,
                            width: BORDER_SIZE,
                            height,
                            backgroundColor: "black"
                        }}
                    ></div>
                ) : null}
                {/* Right Border */}
                {rightBorder ? (
                    <div
                        style={{
                            position: "absolute",
                            top: y,
                            left: x + width - BORDER_SIZE,
                            width: 3,
                            height,
                            backgroundColor: "black"
                        }}
                    ></div>
                ) : null}
                {/* Top Border */}
                {topBorder ? (
                    <div
                        style={{
                            position: "absolute",
                            top: y,
                            left: x,
                            width,
                            height: BORDER_SIZE,
                            backgroundColor: "black"
                        }}
                    ></div>
                ) : null}
                {/* Bottom Border */}
                {bottomBorder ? (
                    <div
                        style={{
                            position: "absolute",
                            top: y + height - BORDER_SIZE,
                            left: x,
                            width,
                            height: BORDER_SIZE,
                            backgroundColor: "black"
                        }}
                    ></div>
                ) : null}
            </div>
        </div>
    );
};

const ChamberG = ({width = 150, height = 200, pressure = 0, x = 0, y = 0, name}) => {
    let color = "green";
    if (pressure > 0) {
        color = "red";
    }
    return (
        <div style={{display: "flex", alignItems: "center", gap: "8px", position: "relative"}}>
            <div>
                <div
                    style={{
                        position: "absolute",
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
                        fontFamily: "Helvetica, Arial, sans-serif"
                    }}
                >
                    {name}
                    <br />
                </div>
            </div>
        </div>
    );
};

const ValveG = ({width = 150, height = 80, pressure = 0, x = 0, y = 0, name}) => {
    let color = "red";
    if (pressure > 0) {
        color = "green";
    }
    return (
        <div style={{display: "flex", alignItems: "center", gap: "8px", position: "relative"}}>
            <div>
                <div
                    style={{
                        position: "absolute",
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
                        fontFamily: "Helvetica, Arial, sans-serif"
                    }}
                >
                    {name}
                    <br />
                </div>
            </div>
        </div>
    );
};

export {ChamberG, PipeG, ValveG};
