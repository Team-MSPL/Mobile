import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {axiosAuth} from '../travel-info/travel.slice';
import {userSliceActions} from './user.slice';
import {Alert} from 'react-native';
const initialState: LiteState = {
	login: [],
	anonymous: false,
};
//로그인&회원가입
export const socialConnect = createAsyncThunk('/user/signUpAndIn', async (data: socialConnectType, thunkAPI) => {
	try {
		const response = await axiosAuth.post('/user/signUpAndIn', {
			userName: data.userName,
			userProfileImage: data.userProfileImage,
			userToken: data.userToken,
			loginProvider: data.loginProvider,
			signUpFlag: data.signUpFlag,
		});
		let userData = response.data;
		//성공했을때
		if (response.status != 202) {
			thunkAPI.dispatch(userSliceActions.login());
			thunkAPI.dispatch(userSliceActions.setUserInfo(userData));
			const loginValues: [string, string][] = [
				['userName', userData.userName],
				['userProfileImage', data.userProfileImage],
				['userToken', data.userToken?.toString()],
				['loginProvider', data.loginProvider],
			];
			await AsyncStorage.multiSet(loginValues);
		}
		return response.status;
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
		setAnonymous: (state, {payload}) => {
			state.anonymous = payload;
		},
	},
	extraReducers: builder => {},
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
	anonymous: boolean;
}

interface socialConnectType {
	userName: string | null;
	userProfileImage: string | null;
	userToken: string | null;
	loginProvider: string;
	signUpFlag: boolean;
}
