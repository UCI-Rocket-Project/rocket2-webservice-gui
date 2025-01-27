import {createContext, useContext} from "react";
import {useTooling} from "./useTooling";

const ToolingContext = createContext(undefined);

export const ToolingContextProvider = ({children}) => {
    const tooling = useTooling();

    return <ToolingContext.Provider value={tooling}>{children}</ToolingContext.Provider>;
};

export const useToolingContext = () => {
    const context = useContext(ToolingContext);
    if (!context) {
        throw new Error("useToolingContext must be used within a ToolingContextProvider");
    }
    return context;
};
