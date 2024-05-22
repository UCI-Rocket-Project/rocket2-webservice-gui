import axios from "axios";

const client = axios.create({baseURL: "http://localhost:8000/"});

export const getEcuState = () => {
    return client.get("ecu/state").catch(() => {
        console.log("error");
    });
};
export const getGseState = () => {
    return client.get("gse/state").catch(() => {
        console.log("error");
    });
};
export const getDatabase = (data_type, startTime, endTime) => {
    console.log("GETTING DATABASE", data_type);
    let params = null;
    if (startTime || endTime) {
        params = {
            startTime: startTime,
            endTime: endTime
        };
    }
    console.log(params, "params");
    return client.get("data/" + data_type, {params: params}).catch(() => {
        console.log("error");
    });
};
export const updateRocket = (systemName, name, newState) => {
    //Ex: ecu/state/CopvVent/1
    const resp = client.post(systemName + "/state/" + name + "/" + (newState ? "1" : "0"));
    console.log(resp);
    // TODO error handling for if we cant get response
    return resp;
};
