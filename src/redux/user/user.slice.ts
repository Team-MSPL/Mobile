import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const name = 'user';

const initialUserState: UserState = {
	userId: '',
	userName: '',
	socialloginProvider: undefined,
	isLogin: false,
	functionToken: 0,
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

const userSlice = createSlice({
	name: 'user',
	initialState: initialUserState,
	reducers: {
		setUserInfo(state, {payload}) {
			state.socialloginProvider = payload.socialloginProvider;
			state.userName = payload.userName;
			state.userId = payload.userId;
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
	},
});

export const userActions = userSlice.actions;
export default userSlice.reducer;

export interface UserState {
	userId: string;
	userName: string;
	socialloginProvider: 'apple' | 'google' | 'kakao' | null | undefined;
	isLogin: boolean;
	functionToken: number;
}
