import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosAuth from '../api/api';

const name = 'setting';
const initialState: SettingState = {
	isAppLoaded: false,
	isFirstLaunched: null,
	hasPermission: false,
	noPermission: false,
	nowVersion: 0,
	latestVersion: 0,
	needVersionUpdate: false,
	updateStoreUrl: '',
};

export const getPlaceRecommendInMainScreen = createAsyncThunk(
	'/placeRecommendInMainScreen',
	async (_, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.get(`/place/placeRecommendInMainScreen`);
			return response.data;
		} catch (error: any) {
			throw rejectWithValue(error.code);
		}
	},
);
const settingSlice = createSlice({
	name,
	initialState,
	reducers: {
		setAppLoaded: (state, action) => {
			state.isAppLoaded = action.payload;
		},
		setFirstLaunched: (state, action) => {
			state.isFirstLaunched = action.payload;
		},
		setPermission: (state, action) => {
			state.hasPermission = action.payload;
		},
		setNopermission: (state, action) => {
			state.noPermission = action.payload;
		},
		setVersion: (state, {payload}) => {
			state.nowVersion = payload.nowVersion;
			state.latestVersion = payload.latestVersion;
		},
		setNeedVersionUpdate: (state, {payload}) => {
			state.needVersionUpdate = payload.status;
			state.updateStoreUrl = payload.storeUrl;
		},
	},
});

interface SettingState {
	isAppLoaded: boolean;
	isFirstLaunched: boolean | null;
	hasPermission: boolean; // 앱 접근 권한
	noPermission: boolean;
	nowVersion: number;
	latestVersion: number;
	needVersionUpdate: boolean;
	updateStoreUrl: string;
}

export const {setAppLoaded, setFirstLaunched, setPermission, setNopermission, setVersion, setNeedVersionUpdate} =
	settingSlice.actions;
export default settingSlice.reducer;
