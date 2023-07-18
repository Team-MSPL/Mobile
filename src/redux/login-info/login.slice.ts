import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_ROUTE} from '@env';
const initialState: LiteState = {
	login: [],
	userInfo: [],
	a: '',
};

const axiosAuth = axios.create({
	baseURL: API_ROUTE,
	headers: {'content-type': 'application/json'},
});

export const socialLogin = createAsyncThunk('/auth/login', async (data: LoginType, thunkAPI) => {
	try {
		const response = await axiosAuth.post(
			'/auth/login',
			{userName: data.userName, userProfileImage: data.userProfileImage, userToken: data.userToken},
			{
				headers: {
					Authorization: 'Bearer ' + data.userToken,
				},
			},
		);
		return response.data;
	} catch (error) {
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
	extraReducers: builder => {
		builder.addCase(socialLogin.fulfilled, (state, {payload}) => {
			setStorage('token', payload.userJwtToken);
			state.a = payload.userJwtToken;
		});
	},
});

// get
export const getStorage = async (key: string) => {
	const result = await AsyncStorage.getItem(key);
	return result && JSON.parse(result);
};

// set
export const setStorage = async (key: string, value: string) => {
	return await AsyncStorage.setItem(key, JSON.stringify(value));
};

// remove
export const removeStorage = async (key: string) => {
	return await AsyncStorage.removeItem(key);
};

export const loginSliceActions = loginSlice.actions;
export default loginSlice.reducer;

interface LiteState {
	login: LoginType[];
	userInfo: string[];
	a: string;
}

interface LoginType {
	userName: string | null;
	userProfileImage: string | null;
	userToken: string | null;
}
