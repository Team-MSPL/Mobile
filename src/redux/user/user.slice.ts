import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosAuth from '../api/api';

const name = 'user';

const initialUserState: UserState = {
	userId: '',
	userName: '',
	userProfileImage: '',
	userJwtToken: '',
	functionToken: 0,
	socialloginProvider: undefined,
	isLogin: false,
	isFirstLaunch: 'false',
	signUpReward: false,
	anonymousKeep: false,
	blockUserList: [],
};

//회원탈퇴
export const userWithdraw = createAsyncThunk(
	'/user/withdraw',
	async (data: {userId: string; signUpFirebase: boolean}, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.delete('/user/withdraw', {data});
			return response.data;
		} catch (err: any) {
			throw rejectWithValue(err.response.data);
		}
	},
);
//쿠폰입력
export const couponCheck = createAsyncThunk(
	'/marketing/useCoupon',
	async (data: {couponCode: string; functionToken: number}, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.patch('/marketing/useCoupon', data);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response.data);
		}
	},
);
//이용권관리
export const updateFunctionToken = createAsyncThunk(
	'/user/updateFunctionToken',
	async (data: {functionToken: number}, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.patch('/user/updateFunctionToken', data);
			return data;
		} catch (err: any) {
			throw rejectWithValue(err.response.data);
		}
	},
);
//이용권관리
export const inquiryEnroll = createAsyncThunk(
	'/inquiry/inquiry',
	async (data: {userName: string; inquire: string}, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.post('/inquiry/inquiry', data);
			return data;
		} catch (err: any) {
			throw rejectWithValue(err.response.data);
		}
	},
);

//회원 쪽지 조회
export const getNoteList = createAsyncThunk('/user/noteList', async (_, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.get('/user/noteList');
		return response.data;
	} catch (err: any) {
		throw rejectWithValue(err.response.data);
	}
});

//사용자 프로필 변경하기
export const updateProfile = createAsyncThunk(
	'/updateProfile',
	async (data: {userName: string; userProfileImage: string}, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.patch(`/user/updateProfile`, data);
			return response.data;
		} catch (err: any) {
			throw rejectWithValue(err.response.data);
		}
	},
);

//이용권 로그 확인하기
export const getTokenLog = createAsyncThunk('/tokenLog', async (_, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.get(`/manageUser/tokenLog`);
		return response.data;
	} catch (err: any) {
		throw rejectWithValue(err.response.data);
	}
});

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
			state.blockUserList = payload.blockUserList;
			state.isLogin = true;
			console.log('왔는데용?');
		},
		reset: state => {
			console.log('오긴함');
			Object.assign(state, initialUserState);
		},
		login(state) {
			state.isLogin = true;
		},
		setBlockList(state, {payload}) {
			state.blockUserList = [...state.blockUserList, payload];
		},
		setNicknameAndImage(state, {payload}) {
			state.userProfileImage = payload.userProfileImage;
			state.userName = payload.userName;
		},
		setIsFirstLaunch(state, {payload}) {
			state.isFirstLaunch = payload;
		},
		setSignUpReward(state, {payload}) {
			state.signUpReward = payload;
		},
		setAnonymousKeep(state, {payload}) {
			state.anonymousKeep = payload;
		},
		setAnonymous(state) {
			state.isLogin = true;
			state.userId = 'x';
			state.userName = '나그네';
			state.userProfileImage = '';
			state.userJwtToken = '';
			state.functionToken = 0;
			state.socialloginProvider = 'anonymous';
			axiosAuth.defaults.headers.Authorization = `Bearer x`;
		},
	},
	extraReducers: builder => {
		builder.addCase(userWithdraw.fulfilled, state => {
			// /AsyncStorage.getAllKeys().then(removeList => AsyncStorage.multiRemove(removeList));
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
		builder.addCase(couponCheck.fulfilled, (state, {payload}) => {
			state.functionToken = payload.functionToken;
		});
	},
});

export const userSliceActions = userSlice.actions;
export default userSlice.reducer;

export interface UserState {
	userId: string;
	userName: string;
	socialloginProvider: 'apple' | 'google' | 'kakao' | 'anonymous' | null | undefined;
	userJwtToken: string | null;
	isLogin: boolean;
	functionToken: number;
	userProfileImage: string;
	isFirstLaunch: string;
	signUpReward: boolean;
	anonymousKeep: boolean;
	blockUserList: string[];
}

export interface TokenLogType {
	tokenLogContent: string;
	tokenLogNumber: number;
	tokenLogDate: string;
	_id: string;
}
