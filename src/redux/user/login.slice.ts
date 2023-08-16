import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {axiosAuth} from '../travel-info/travel.slice';
import {userActions} from './user.slice';
const initialState: LiteState = {
	login: [],
	userInfo: [],
	jwtToken: '',
	anonymous: false,
};

export const socialConnect = createAsyncThunk('/user/connect', async (data: LoginType, thunkAPI) => {
	try {
		// const response = await axiosAuth.post('/user/connect', {
		//    userName: data.userName,
		//    userId: data.userId,
		//    socialloginProvider: data.socialloginProvider,
		// });
		// //데이터일거얌 jwt는 헤더에!
		// let userData = response.data;
		// //성공했을때
		// if (response.status == 200) {
		//    thunkAPI.dispatch(userActions.login());
		//    thunkAPI.dispatch(userActions.setUserInfo(userData));
		//    await AsyncStorage.setItem('provider', userData.socialloginProvider);
		//    await AsyncStorage.setItem('userName', userData.userName);
		//    await AsyncStorage.setItem('userId', userData.userId); //스트링 아니면 toStrign()
		//    await AsyncStorage.setItem('userJwtToken', userData.userJwtToken);
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
export const temporarySignUp = createAsyncThunk('/temporarySignUp', async (data: temporaryType, thunkAPI) => {
	try {
		const response = await axiosAuth.post('user/signUp', {
			userName: data.userName,
			userProfileImage: data.userProfileImage,
			userToken: data.userToken,
		});

		await AsyncStorage.setItem('userProfileImage', response.data.userProfileImage);
		await AsyncStorage.setItem('userName', response.data.userName);
		await AsyncStorage.setItem('userId', response.data.userToken); //스트링 아니면 toStrign()
		await AsyncStorage.setItem('userJwtToken', response.data.userJwtToken);
		await AsyncStorage.setItem('socialloginProvider', data.socialloginProvider.toString());
		thunkAPI.dispatch(userActions.login());
		thunkAPI.dispatch(
			userActions.setUserInfo({
				userName: response.data.userName,
				userId: response.data.userId,
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
			const response = await axiosAuth.post('/user/signIn', {
				userName: data.userName,
				userToken: data.userToken,
			});

			await AsyncStorage.setItem('userProfileImage', response.data.userProfileImage);
			await AsyncStorage.setItem('userName', response.data.userName);
			await AsyncStorage.setItem('userId', response.data.userToken); //스트링 아니면 toStrign()
			await AsyncStorage.setItem('userJwtToken', response.data.userJwtToken);
			const socialloginProvider = await AsyncStorage.getItem('socialloginProvider');
			thunkAPI.dispatch(userActions.login());
			thunkAPI.dispatch(
				userActions.setUserInfo({
					userName: response.data.userName,
					userId: response.data.userId,
					socialloginProvider: socialloginProvider,
					userProfileImage: response.data.userProfileImage,
				}),
			);
			console.log(response.data);
			return response.data;
		} catch (error) {
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
	socialloginProvider: string;
}
