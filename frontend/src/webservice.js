import axios from "axios";

const client = axios.create({baseURL: "http://localhost:8000/"});

export const getRocketState = () => {
    return client.get("ecu/state").catch(() => {
        console.log("error");
    });
};

export const updateRocket = (solenoidName, solenoidState) => {
    return client.post("ecu/solenoid/" + solenoidName + "/" + (solenoidState ? "1" : "0"));
};
