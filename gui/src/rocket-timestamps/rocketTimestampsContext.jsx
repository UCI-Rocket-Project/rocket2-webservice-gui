import {createContext, useContext} from "react";
import {useRocketTimestamps} from "./useRocketTimestamps";

const RocketTimestampsContext = createContext(undefined);

export const RocketTimestampsContextProvider = ({children}) => {
    const timestamps = useRocketTimestamps();

    return (
        <RocketTimestampsContext.Provider value={timestamps}>
            {children}
        </RocketTimestampsContext.Provider>
    );
};

export const useRocketTimestampsContext = () => {
    const context = useContext(RocketTimestampsContext);
    if (!context) {
        throw new Error(
            "useRocketTimestampsContext must be used within a RocketTimestampsContextProvider"
        );
    }
    return context;
};
