import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getRocketState, updateRocket} from "../webservice";
const initialState = {
    solenoids: {},
    pts: {}
};

export const fetchRocketState = createAsyncThunk("rocket/fetchRocketState", async (_, {dispatch}) => {
    try {
        const rocketState = (await getRocketState()).data;
        console.log("recv", rocketState);

        let solenoids = {};
        let pts = {};
        for (const key in rocketState) {
            if (key.includes("solenoid")) {
                // Keys are solenoid_feedback_name or solenoid_expected_name
                console.log(key);
                let split_key = key.split("_");
                if (!Object.keys(solenoids).includes(split_key[2])) {
                    solenoids[split_key[2]] = {};
                }
                solenoids[split_key[2]][split_key[1]] = rocketState[key];
            }
            if (key.includes("pt")) {
                let split_key = key.split("_");
                pts[split_key[1]] = rocketState[key];
            }
        }
        dispatch(setPts(pts));
        dispatch(setSolenoids(solenoids));
    } catch (error) {
        // Handle errors (dispatch an error action or throw the error)
        throw error;
    }
});

export const setRocketSolenoid = createAsyncThunk("rocket/setRocketSolenoid", async ({solenoidName, solenoidState}, {dispatch}) => {
    try {
        console.log("sending");
        const response = await updateRocket(solenoidName, solenoidState);
    } catch (error) {
        // Handle errors (dispatch an error action or throw the error)
        throw error;
    }
});

export const rocketSlice = createSlice({
    name: "rocket",
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        toggleSolenoid: (state, action) => {
            const solenoidName = action.payload;
            state.solenoids[solenoidName]["expected"] = !state.solenoids[solenoidName]["expected"];
            console.log("state updated");
        },
        setSolenoids: (state, action) => {
            for (let solenoidName in action.payload) {
                state.solenoids[solenoidName] = action.payload[solenoidName];
            }
        },
        setPts: (state, action) => {
            for (let ptName in action.payload) {
                state.pts[ptName] = action.payload[ptName];
            }
        }
    }
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    // extraReducers: (builder) => {
    //   builder
    //     .addCase(incrementAsync.pending, (state) => {
    //       state.status = 'loading';
    //     })
    //     .addCase(incrementAsync.fulfilled, (state, action) => {
    //       state.status = 'idle';
    //       state.value += action.payload;
    //     });
    // },
});

export const {toggleSolenoid, setSolenoids, setPts} = rocketSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectSolenoids = (state) => state.rocket.solenoids;

export const selectPts = (state) => state.rocket.pts;

export default rocketSlice.reducer;
