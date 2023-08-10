import {createSlice} from '@reduxjs/toolkit';
const initialState: LiteState = {
	tendency: [[]],
	distance: 0,
	popularity: 0,
};

export const RegionRecommendSlice = createSlice({
	name: 'loading',
	initialState,
	reducers: {
		enrollTendency: (state, {payload}) => {
			state.tendency = payload;
		},
		enrollDistance: (state, {payload}) => {
			state.distance = payload;
		},
		enrollPopularity: (state, {payload}) => {
			state.popularity = payload;
		},
	},
});

export const RegionRecommendSliceActions = RegionRecommendSlice.actions;
export default RegionRecommendSlice.reducer;

interface LiteState {
	tendency: boolean[][];
	distance: number;
	popularity: number;
}
