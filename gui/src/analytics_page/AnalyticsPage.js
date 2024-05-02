import React, {useState, useEffect, useRef} from "react";
import Chart from "chart.js/auto";
import {getDatabase} from "../webservice";
import styles from "./AnalyticsPage.module.css";
import _ from "lodash";
export function AnalyticsPage() {
    const [data, setData] = useState([]);
    const [newKey, setNewKey] = useState("pressureLng");
    const [selectedKeys, setSelectedKeys] = useState(["pressureCopv"]);
    const chartRef = useRef(null);
    const keys = ["pressureInjectorLox", "pressureInjectorLng", "pressureLox", "pressureLng"];
    const fetchData = async (dataString) => {
        const response = (await getDatabase(dataString)).data;
        setData(response);
    };

    useEffect(() => {
        fetchData("pressureCopv");
    }, []);

    useEffect(() => {
        if (data.data?.length > 0) {
            if (chartRef.current) {
                chartRef.current.destroy(); // Destroy previous chart instance
            }

            let parsedSensors = _.fromPairs(_.map(data.sensors, (key) => [key, []]));
            let time_data = [];
            for (let row of data.data) {
                time_data.push(row[0]);
                for (let i = 0; i < data.sensors.length; i++) {
                    parsedSensors[data.sensors[i]].push(row[i + 1]);
                }
            }
            const datasets = Object.keys(parsedSensors).map((key) => ({
                label: key,
                data: parsedSensors[key]
            }));
            const chartData = {
                labels: time_data,
                datasets: datasets
            };

            const ctx = document.getElementById("graph").getContext("2d");
            chartRef.current = new Chart(ctx, {
                type: "line",
                data: chartData,
                options: {
                    plugins: {
                        legend: {
                            display: true
                        }
                    }
                }
            });
        }
    }, [data]);

    const handleDropdownChange = (event) => {
        console.log("dropdown change");
        const newVal = event.target.value;
        setNewKey(newVal);
    };

    const handleAddKey = () => {
        if (newKey) {
            setSelectedKeys(selectedKeys.concat(newKey));
            setNewKey("");
        }
    };

    const handleDeleteKey = (index) => {
        setSelectedKeys(selectedKeys.filter((_, i) => i !== index));
    };

    const generateGraph = () => {
        fetchData(_.reduce(selectedKeys, (acc, key, _) => acc + key + ",", "").slice(0, -1));
    };

    return (
        <div>
            <h2>Analytics Page</h2>
            <div className={styles.row}>
                <div className={styles.selectionBox}>
                    {_.map(selectedKeys, (selectedKey, index) => (
                        <div
                            key={selectedKey + index}
                            className={styles.selectedKey}
                        >
                            <h1 className={styles.keyTitle}>{selectedKey}</h1>
                            <button
                                className={styles.keyButton}
                                onClick={() => handleDeleteKey(index)}
                            >
                                -
                            </button>
                        </div>
                    ))}
                    {keys.filter((item) => !selectedKeys.includes(item)).length > 0 ? (
                        <div>
                            <select onChange={handleDropdownChange}>
                                {_.map(
                                    keys.filter((item) => !selectedKeys.includes(item)),
                                    (key) => (
                                        <option
                                            key={key}
                                            value={key}
                                        >
                                            {key}
                                        </option>
                                    )
                                )}
                            </select>
                            <button onClick={handleAddKey}>+</button>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div className={styles.graphBox}>
                    <canvas
                        style={{maxHeight: "800px", maxWidth: "100%"}}
                        id="graph"
                    ></canvas>
                </div>
            </div>

            <button onClick={generateGraph}>Generate</button>
        </div>
    );
}
