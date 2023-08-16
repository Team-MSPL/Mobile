import AsyncStorage from '@react-native-async-storage/async-storage';

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Alert} from 'react-native';
import {axiosAuth} from '../travel-info/travel.slice';
import {userSliceActions} from './user.slice';
const initialState: LiteState = {
	login: [],
	userInfo: [],
	jwtToken: '',
	anonymous: false,
};
//로그인&회원가입
export const socialConnect = createAsyncThunk('/user/signUpAndIn', async (data: temporaryType, thunkAPI) => {
	try {
		console.log('와쓔', data);
		const response = await axiosAuth.post('/user/signUpAndIn', {
			userName: data.userName,
			userProfileImage: data.userProfileImage,
			userToken: data.userToken,
			loginProvider: data.loginProvider,
			signUpFlag: data.signUpFlag,
		});
		//데이터일거얌 jwt는 헤더에!
		let userData = response.data;
		console.log('오펜하이머', response.status);
		//성공했을때                                                       소셜로그인 토큰이 필요하다./
		if (response.status != 202) {
			console.log('성공했네융', userData);
			thunkAPI.dispatch(userSliceActions.login());
			thunkAPI.dispatch(userSliceActions.setUserInfo({...userData, userToken: data.userToken}));
			await AsyncStorage.setItem('provider', userData.loginProvider);
			await AsyncStorage.setItem('userName', userData.userName);
			await AsyncStorage.setItem('userToken', data.userToken?.toString());
			await AsyncStorage.setItem('userId', userData.userId); //스트링 아니면 toStrign() userToken을 계속 가지고 있어야한다!
			await AsyncStorage.setItem('userJwtToken', userData.userJwtToken);
		}
		return response.status;
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});
export const temporarySignUp = createAsyncThunk('/temporarySignUp', async (data: temporaryType, thunkAPI) => {
	try {
		const response = await axiosAuth.post('user/signUp', {
			userName: data.userName,
			userProfileImage: data.userProfileImage,
			userToken: data.userToken,
			signUpFlag: data.signUpFlag,
		});

		await AsyncStorage.setItem('userProfileImage', response.data.userProfileImage);
		await AsyncStorage.setItem('userName', response.data.userName);
		await AsyncStorage.setItem('userId', response.data.userToken); //스트링 아니면 toStrign()
		await AsyncStorage.setItem('userJwtToken', response.data.userJwtToken);
		await AsyncStorage.setItem('socialloginProvider', data.socialloginProvider.toString());
		thunkAPI.dispatch(userSliceActions.login());
		thunkAPI.dispatch(
			userSliceActions.setUserInfo({
				userName: response.data.userName,
				userId: response.data.userToken, //지금은 토큰으로 처리하게 되어있어서 토큰인데 추후에는 userId로 ㄱ
				socialloginProvider: data.socialloginProvider,
				userProfileImage: response.data.userProfileImage,
			}),
		);
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.log(error);
		return error;
	}
});
export const temporarySignIn = createAsyncThunk(
	'/temporarySignIn',
	async (data: {userName: string; userToken: string}, thunkAPI) => {
		try {
			console.log('왔슈');
			const response = await axiosAuth.post('/user/signIn', {
				userName: data.userName,
				userToken: data.userToken,
			});
			console.log('안왔슈', response);
			await AsyncStorage.setItem('userProfileImage', response.data.userProfileImage);
			await AsyncStorage.setItem('userName', response.data.userName);
			await AsyncStorage.setItem('userId', response.data.userToken); //스트링 아니면 toStrign()
			await AsyncStorage.setItem('userJwtToken', response.data.userJwtToken);
			const socialloginProvider = await AsyncStorage.getItem('socialloginProvider');
			thunkAPI.dispatch(userSliceActions.login());
			thunkAPI.dispatch(
				userSliceActions.setUserInfo({
					userName: response.data.userName,
					userId: response.data.userToken, //지금은 토큰으로 처리하게 되어있어서 토큰인데 추후에는 userId로 ㄱ
					socialloginProvider: socialloginProvider,
					userProfileImage: response.data.userProfileImage,
					functionToken: response.data.functionToken,
				}),
			);
			console.log('갸갸ㅑ');
			console.log(response.data);
			console.log('갸갸?ㅑ');
			return response.data;
		} catch (error) {
			Alert.alert('로그인 과정에서 오류가 생겼습니다');
			console.log(error);
			return error;
		}
	},
);

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
		//    console.log(payload);
		//    // setStorage('token', payload.userJwtToken);
		//    // setStorage('test', '1234');
		//    state.jwtToken = payload.userJwtToken;
		// });
		builder.addCase(temporarySignUp.fulfilled, (state, {payload}) => {
			console.log(payload);
			// setStorage('token', payload.userJwtToken);
			// setStorage('test', '1234');
			state.jwtToken = payload.userJwtToken;
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
	jwtToken: string;

	anonymous: boolean;
}

interface LoginType {
	userName: string | null;
	//userProfileImage: string | null;
	userId: string | null;
	socialloginProvider: string | null;
}
interface temporaryType {
	userName: string | null;
	//userProfileImage: string | null;
	userProfileImage: string | null;
	userToken: string | null;
	loginProvider: string;
	signUpFlag: boolean;
}
