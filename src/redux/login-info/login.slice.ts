import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

const initialState: LiteState = {
	login: [],
	userInfo: [],
};

export const postUserLogin = createAsyncThunk('POST/Login', async (data, thunkAPI) => {
	try {
		const response = await axios.post('http://3.39.14.168:8080/auth/login', data);
		console.log('성공', response.data);
		return thunkAPI.fulfillWithValue(response.data);
	} catch (error) {
		console.log('실패', error);
		return thunkAPI.rejectWithValue(error);
	}
});

export const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		setLoginInfo: (state, {payload}) => {
			state.login = payload;
		},
	},
});

export const loginSliceActions = loginSlice.actions;
export default loginSlice.reducer;

interface LiteState {
	login: LoginType[];
	userInfo: string[];
}

interface LoginType {
	userName: string;
	userProfileImage: string;
	userToken: string;
}
