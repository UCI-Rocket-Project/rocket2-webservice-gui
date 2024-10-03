import axios from "axios";

const client = axios.create({baseURL: "http://localhost:8000/"});

export const getEcuState = () => {
    return client.get("ecu/state").catch(() => {
        console.log("error");
    });
};

export const getSystemKeys = (systemName) => {
    /**
     * Given the name of the avionics system, returns the keys that are in it's packet
     */
    return client.get(systemName + "/keys").catch(() => {
        console.log("error");
    });
};

export const getGseState = () => {
    return client.get("gse/state").catch(() => {
        console.log("error");
    });
};

export const getDatabase = (systemName, data_type, startTime, endTime) => {
    let params = null;
    if (startTime || endTime) {
        params = {
            startTime: startTime,
            endTime: endTime
        };
    }
    return client.get("data/" + systemName + "/" + data_type, {params: params}).catch(() => {
        console.log("error");
    });
};

export const saveAndClearDatabase = () => {
    return client.post("data/save");
};

export const updateRocket = (systemName, name, newState) => {
    //Ex: ecu/state/CopvVent/1
    const resp = client.post(systemName + "/state/" + name + "/" + (newState ? "1" : "0"));
    console.log(resp);
    // TODO error handling for if we cant get response
    return resp;
};
