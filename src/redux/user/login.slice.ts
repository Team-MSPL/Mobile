import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {userSliceActions} from './user.slice';
import axiosAuth from '../api/api';
const initialState: LiteState = {};
//로그인&회원가입
export const socialConnect = createAsyncThunk('/user/signUpAndIn', async (data: socialConnectType, thunkAPI) => {
	try {
		const response = await axiosAuth.post('/user/signUpAndIn', {
			userName: data.userName,
			userProfileImage: data.userProfileImage,
			userToken: data.userToken,
			loginProvider: data.loginProvider,
			signUpFlag: data.signUpFlag,
			fcmToken: data.fcmToken,
			version: data.version,
		});
		let userData = {...response.data, userIdToken: data.userToken};
		//성공했을때
		if (response.status != 202) {
			axiosAuth.defaults.headers.Authorization = `Bearer ${userData.userJwtToken}`;
			thunkAPI.dispatch(userSliceActions.setUserInfo(userData));
			if (response.status == 203) {
				thunkAPI.dispatch(userSliceActions.setReLogin(true));
			}
			const loginValues: [string, string][] = [
				['userName', userData.userName],
				['userProfileImage', data.userProfileImage],
				['userToken', data.userToken?.toString()],
				['loginProvider', data.loginProvider],
				['fcmToken', data.fcmToken.toString()],
			];
			await AsyncStorage.multiSet(loginValues);
			//axiosAuth.defaults.headers.Authorization = `Bearer ${userData.userJwtToken}`;
		}
		return response.data;
	} catch (error) {
		throw thunkAPI.rejectWithValue(error);
	}
});

export const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {},
	extraReducers: builder => {},
});
export const loginSliceActions = loginSlice.actions;
export default loginSlice.reducer;

interface LiteState {}

interface socialConnectType {
	userName: string | null;
	userProfileImage: string | null;
	userToken: string | null;
	loginProvider: string;
	signUpFlag: boolean;
	fcmToken: string;
	version: number;
}
