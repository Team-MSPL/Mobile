import {createSlice} from '@reduxjs/toolkit';
const initialState: LiteState = {
	isLoading: false,
};

export const LoadingSlice = createSlice({
	name: 'loading',
	initialState,
	reducers: {
		onLoading: state => {
			state.isLoading = true;
		},
		offLoading: state => {
			state.isLoading = false;
		},
	},
});

export const LoadingSliceActions = LoadingSlice.actions;
export default LoadingSlice.reducer;

interface LiteState {
	isLoading: boolean;
}
