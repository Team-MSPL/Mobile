import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosAuth from '../api/api';

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
	blockUserList: [],
	pushNotify: false,
	fcmToken: '',
	userIdToken: '',
	reLogin: false,
	analyticeFlag: false,
};

//회원탈퇴
export const userWithdraw = createAsyncThunk(
	'/user/withdraw',
	async (data: {userId: string; signUpFirebase: boolean; withdrawReasonList: string[]}, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.delete('/user/withdraw', {data});
			return response.data;
		} catch (err: any) {
			throw rejectWithValue(err.response.data);
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
//공지사항 조회
export const getNotice = createAsyncThunk('/notice/noticeList', async (_, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.get('/notice/noticeList');
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

//광고 시청 횟수 확인
export const getWatchADTime = createAsyncThunk('/manageUser/watchADTime', async (_, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.get(`/manageUser/watchADTime`);
		return response.data;
	} catch (err: any) {
		throw rejectWithValue(err.response.data);
	}
});

//광고 시청 횟수 업데이트
export const setWatchADTime = createAsyncThunk(
	'/manageUser/setWatchADTime',
	async (data: {watchADTime: number}, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.patch(`/manageUser/setWatchADTime`, data);
			return response.data;
		} catch (err: any) {
			throw rejectWithValue(err.response.data);
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
			state.blockUserList = payload.blockUserList;
			state.isLogin = true;
			state.fcmToken = payload.fcmToken;
			state.userIdToken = payload.userIdToken;
		},
		setReLogin(state, {payload}) {
			state.reLogin = payload;
		},
		reset: state => {
			Object.assign(state, initialUserState);
		},
		login(state) {
			state.isLogin = true;
		},
		setPushNotify(state, {payload}) {
			state.pushNotify = payload;
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
		setFcmToken(state, {payload}) {
			state.fcmToken = payload.fcmToken;
		},
		setAnalyticeFlag(state, {payload}) {
			state.analyticeFlag = payload;
		},
	},
	extraReducers: builder => {
		builder.addCase(userWithdraw.fulfilled, state => {
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
	isFirstLaunch: string;
	signUpReward: boolean;
	blockUserList: string[];
	pushNotify: boolean;
	fcmToken: string;
	userIdToken: string;
	reLogin: boolean;
	analyticeFlag: boolean;
}
