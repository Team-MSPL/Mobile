import {createSlice} from '@reduxjs/toolkit';

const initialState: LiteState = {
	region: [],
	day: [],
	time: [],
};

export const travelSlice = createSlice({
	name: 'travel',
	initialState,
	reducers: {
		selectRegion: (state, {payload}) => {
			state.region = payload;
		},
		setRegion: state => {
			state.region = [];
		},
		selectDay: (state, {payload}) => {
			state.day = payload;
		},
		setDay: (state, {payload}) => {
			state.day = payload;
		},
	},
});

export const travelSliceActions = travelSlice.actions;
export default travelSlice.reducer;

interface LiteState {
	region: string[];
	day: string[];
	time: string[];
}
