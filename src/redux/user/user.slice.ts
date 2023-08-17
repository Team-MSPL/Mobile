import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {axiosAuth} from '../travel-info/travel.slice';

const name = 'user';

const initialUserState: UserState = {
	userId: '',
	userName: '',
	userProfileImage: '',
	userJwtToken: '',
	functionToken: 0,
	socialloginProvider: undefined,
	isLogin: false,
};

// 로그아웃
export const logout = createAsyncThunk('user/logout', async (_, {rejectWithValue}) => {
	try {
		// 로그아웃 시 플래그같은거.
		console.log('ㅁㅁ');
		//return (await api.post('/user/logout')).data;

		return 0;
	} catch (err: any) {
		throw rejectWithValue(err.response.data);
	}
});

//회원탈퇴
export const userWithdraw = createAsyncThunk(
	'/user/withdraw',
	async (data: {userId: string; signUpFirebase: boolean}, thunkAPI) => {
		try {
			const response = await axiosAuth.delete('/user/withdraw', {data});
			console.log(response);
			return response.data;
		} catch (error) {
			console.log(error);
			return error;
		}
	},
);

//기능토큰관리
export const updateFunctionToken = createAsyncThunk(
	'/user/updateFunctionToken',
	async (data: {functionToken: number}, thunkAPI) => {
		try {
			console.log('왔엉', data);
			const response = await axiosAuth.patch('/user/updateFunctionToken', data);
			console.log('안뇽', response);
			return data;
		} catch (error) {
			console.log('에러에유', error);
			return error;
		}
	},
);

//사용자 프로필 변경하기
export const updateProfile = createAsyncThunk(
	'/updateProfile',
	async (data: {userName: string; userProfileImage: string}, thunkAPI) => {
		try {
			const response = await axiosAuth.patch(`/user/updateProfile`, data);
			console.log(response.data);

			// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
			return response.data;
		} catch (error) {
			console.log(error);
			return error;
		}
	},
);
const userSlice = createSlice({
	name: 'user',
	initialState: initialUserState,
	reducers: {
		setUserInfo(state, {payload}) {
			state.userId = payload.userId;
			state.userName = payload.userName;
			state.userProfileImage = payload.userProfileImage;
			state.userJwtToken = payload.userjwtToken;
			state.functionToken = payload.functionToken;
			state.socialloginProvider = payload.loginProvider;
		},
		reset: state => {
			console.log('오긴함');
			Object.assign(state, initialUserState);
		},
		login(state) {
			state.isLogin = true;
		},
	},
	extraReducers: builder => {
		// 로그아웃 지금은 다 지워버리지만 추후 처음런치때나 그런거 체크도해야할듯
		builder.addCase(logout.fulfilled, state => {
			AsyncStorage.getAllKeys().then(removeList => AsyncStorage.multiRemove(removeList));
			// console.log('왔는딩?');
			// state.functionToken = 0;
			// console.log('허허허?');
			// state.isLogin = false;
			// state.socialloginProvider = null;
			// state.userId = '';
			// state.userName = '';
			//userSlice.actions.reset();
			return {...initialUserState};
		});
		builder.addCase(userWithdraw.fulfilled, state => {
			AsyncStorage.getAllKeys().then(removeList => AsyncStorage.multiRemove(removeList));
			// console.log('왔는딩?');
			// state.functionToken = 0;
			// console.log('허허허?');
			// state.isLogin = false;
			// state.socialloginProvider = null;
			// state.userId = '';
			// state.userName = '';
			//userSlice.actions.reset();
			return {...initialUserState};
		});
		builder.addCase(updateFunctionToken.fulfilled, (state, {payload}) => {
			state.functionToken = payload.functionToken;
		});
	},
});

export const userSliceActions = userSlice.actions;
export default userSlice.reducer;

export interface UserState {
	userId: string;
	userName: string;
	socialloginProvider: 'apple' | 'google' | 'kakao' | null | undefined;
	userJwtToken: string | null;
	isLogin: boolean;
	functionToken: number;
	userProfileImage: string;
}
