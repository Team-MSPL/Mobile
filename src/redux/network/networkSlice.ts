import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosAuth from '../api/api';

const name = 'network';
const initialState: NetworkState = {
	serverConn: true,
	networkConn: true,
};
export const networkCheck = createAsyncThunk('/networkCheck', async (data, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.get('manageNetwork/ping');
		return response;
	} catch (error: any) {
		throw rejectWithValue(error.response.data);
	}
});
const networkSlice = createSlice({
	name,
	initialState,
	reducers: {
		setServerConn: (state, {payload}) => {
			state.serverConn = payload;
		},
		setNetworkConn: (state, {payload}) => {
			state.networkConn = payload;
		},
	},
});

interface NetworkState {
	serverConn: boolean;
	networkConn: boolean;
}

export const networkSliceActions = networkSlice.actions;
export default networkSlice.reducer;
