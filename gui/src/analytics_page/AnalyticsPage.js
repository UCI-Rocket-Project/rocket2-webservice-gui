import React, {useState, useEffect, useRef} from "react";
import Chart from "chart.js/auto";
import {getDatabase, getSystemKeys, saveAndClearDatabase} from "../webservice";
import styles from "./AnalyticsPage.module.css";
import _ from "lodash";
export function AnalyticsPage() {
    const [data, setData] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [systemName, setSystemName] = useState("ecu");
    const [systemKeys, setSystemKeys] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        // update the graph
        const queryString = _.reduce(selectedKeys, (acc, key, _) => acc + key + ",", "").slice(
            0,
            -1
        );
        getDataForSelectedKeys(queryString);
    }, [systemName, selectedKeys, startTime, endTime]);

    useEffect(() => {
        const updateSystemKeys = async () => {
            const resp = (await getSystemKeys(systemName)).data;
            setSystemKeys(resp);
        };
        updateSystemKeys();
        setSelectedKeys([]);
    }, [systemName]);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy(); // Destroy previous chart instance
        }
        if (data?.length > 0) {
            let parsedSensors = _.fromPairs(_.map(selectedKeys, (key) => [key, []]));
            let x_values = [];
            for (let row of data) {
                x_values.push(Math.floor(row[0] / 2000)); // divide by 2000 to change from half milliseconds to seconds
                for (let i = 0; i < selectedKeys.length; i++) {
                    parsedSensors[selectedKeys[i]].push(row[i + 1]);
                }
            }
            const datasets = Object.keys(parsedSensors).map((key) => ({
                label: key,
                data: parsedSensors[key]
            }));
            const chartData = {
                labels: x_values,
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
        } else {
            chartRef.current = null;
        }
    }, [data]);

    const getDataForSelectedKeys = async (dataString) => {
        if (!dataString) {
            return;
        }

        const response = await getDatabase(
            systemName,
            dataString,
            startTime * 2000 || 0,
            endTime * 2000 || 100000000
        );
        const data = response.data;
        setData(data);
    };

    const handleSelectKey = (event) => {
        const newVal = event.target.value;
        setSelectedKeys(selectedKeys.concat(newVal));
    };

    const handleDeleteKey = (index) => {
        setSelectedKeys(selectedKeys.filter((_, i) => i !== index));
    };

    const convertDictToCsv = (datalist) => {
        let csvContent = "time," + selectedKeys.join(",") + "\n";
        for (let i = 0; i < datalist.length; i++) {
            datalist[i][0] = datalist[i][0] / 2000;
            let row = datalist[i];
            csvContent += row.join(",") + "\n";
        }
        return csvContent;
    };

    const downloadCsv = () => {
        const csvContent = convertDictToCsv(data);
        const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "data.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h2>Analytics Page</h2>
            <div className={styles.row}>
                <div className={styles.selectionBox}>
                    <h1>Selected Keys</h1>
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
                    {systemKeys.filter((item) => !selectedKeys.includes(item)).length > 0 ? (
                        <div>
                            <select onChange={handleSelectKey}>
                                {_.map(
                                    systemKeys.filter((item) => !selectedKeys.includes(item)),
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
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div className={styles.graphBox}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Start Time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="End Time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <select
                                value={systemName}
                                onChange={(event) => setSystemName(event.target.value)}
                            >
                                <option value="ecu">ecu</option>
                                <option value="gse">gse</option>
                            </select>
                        </div>
                    </div>
                    <canvas
                        style={{
                            height: "800px",
                            width: "100%",
                            maxHeight: "800px",
                            maxWidth: "100%"
                        }}
                        id="graph"
                    ></canvas>
                    <div>
                        <button onClick={downloadCsv}>Export to CSV</button>
                        <button
                            onClick={() => {
                                setData([]);
                                setSelectedKeys([]);
                                saveAndClearDatabase();
                            }}
                        >
                            Save and Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
