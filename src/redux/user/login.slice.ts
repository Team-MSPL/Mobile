import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_ROUTE, GOOGLE_API_KEY} from '@env';
import {userActions} from './user.slice';
const initialState: LiteState = {
	login: [],
	userInfo: [],
	jwtToken: '',
	anonymous: false,
};

const axiosAuth = axios.create({
	baseURL: API_ROUTE,
	headers: {'content-type': 'application/json'},
});

export const socialConnect = createAsyncThunk('/user/connect', async (data: LoginType, thunkAPI) => {
	try {
		// const response = await axiosAuth.post('/user/connect', {
		// 	userName: data.userName,
		// 	userId: data.userId,
		// 	socialloginProvider: data.socialloginProvider,
		// });
		// //데이터일거얌 jwt는 헤더에!
		// let userData = response.data;
		// //성공했을때
		// if (response.status == 200) {
		// 	thunkAPI.dispatch(userActions.login());
		// 	thunkAPI.dispatch(userActions.setUserInfo(userData));
		// 	await AsyncStorage.setItem('provider', userData.socialloginProvider);
		// 	await AsyncStorage.setItem('userName', userData.userName);
		// 	await AsyncStorage.setItem('userId', userData.userId); //스트링 아니면 toStrign()
		// 	await AsyncStorage.setItem('userJwtToken', userData.userJwtToken);
		// }
		// return response.data;
		thunkAPI.dispatch(userActions.login());
		thunkAPI.dispatch(
			userActions.setUserInfo({
				socialloginProvider: data.socialloginProvider,
				userName: data.userName,
				userId: data.userId,
			}),
		);
		await AsyncStorage.setItem('provider', 'kakao'); //밑에부분들은 response로세팅하믄됨
		await AsyncStorage.setItem('userName', '문성준');
		await AsyncStorage.setItem('userId', 'moon5381'); //스트링 아니면 toStrign()
		await AsyncStorage.setItem('userJwtToken', 'jmtzzzz');
		return 0;
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});
export const tete = createAsyncThunk('/tete', async thunkAPI => {
	try {
		const response = await axiosAuth.get(
			'http://apis.data.go.kr/B551011/KorService1/searchKeyword1?serviceKey=J7laKTTThB5SZdBdab6YA4Nam%2BgRrYc%2FXdqAzSQ%2FDUhLxMWFSUxBVbrn6WDpvTauz4oW2phb3ojdk9YmlZMPww%3D%3D&MobileApp=다님&MobileOS=AND&arrange=A&keyword=$창덕궁',
		);
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.log(error);
		return error;
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
	extraReducers: builder => {
		// builder.addCase(socialConnect.fulfilled, (state, {payload}) => {
		// 	console.log(payload);
		// 	// setStorage('token', payload.userJwtToken);
		// 	// setStorage('test', '1234');
		// 	state.jwtToken = payload.userJwtToken;
		// });
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
	jwtToken: string;

	anonymous: boolean;
}

interface LoginType {
	userName: string | null;
	//userProfileImage: string | null;
	userId: string | null;
	socialloginProvider: string | null;
}
