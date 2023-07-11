import { createSlice } from "@reduxjs/toolkit";

const initialState: LiteState = {
    colorMode: true,  
}

export const colorSlice = createSlice({
    name: "color",
    initialState,
    reducers: {
        setColor: (state) => {
            state.colorMode = !state.colorMode;
        },
    }
})


export const colorSliceActions = colorSlice.actions;
export default colorSlice.reducer;


interface LiteState {
    colorMode: boolean;
   
}