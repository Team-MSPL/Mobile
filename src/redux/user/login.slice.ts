import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {axiosAuth} from '../travel-info/travel.slice';
import {userSliceActions} from './user.slice';
const initialState: LiteState = {
	anonymous: false,
};
//로그인&회원가입
export const socialConnect = createAsyncThunk('/user/signUpAndIn', async (data: socialConnectType, thunkAPI) => {
	try {
		console.log('왔긴한데', data.userName, data.userProfileImage);
		const response = await axiosAuth.post('/user/signUpAndIn', {
			userName: data.userName,
			userProfileImage: data.userProfileImage,
			userToken: data.userToken,
			loginProvider: data.loginProvider,
			signUpFlag: data.signUpFlag,
		});
		console.log('ㅂㅈㄷ');
		let userData = response.data;
		//성공했을때
		if (response.status != 202) {
			axiosAuth.defaults.headers.Authorization = `Bearer ${userData.userJwtToken}`;

			console.log('qwe', userData.userJwtToken);
			thunkAPI.dispatch(userSliceActions.setUserInfo(userData));
			thunkAPI.dispatch(userSliceActions.login());
			const loginValues: [string, string][] = [
				['userName', userData.userName],
				['userProfileImage', data.userProfileImage],
				['userToken', data.userToken?.toString()],
				['loginProvider', data.loginProvider],
			];
			await AsyncStorage.multiSet(loginValues);
			//axiosAuth.defaults.headers.Authorization = `Bearer ${userData.userJwtToken}`;
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
	anonymous: boolean;
}

interface socialConnectType {
	userName: string | null;
	userProfileImage: string | null;
	userToken: string | null;
	loginProvider: string;
	signUpFlag: boolean;
}
