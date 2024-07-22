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
	homeRegionImage: {
		photo: '',
		name: '',
	},
	appLanguages: 'ko-KR',
};
//메인화면 관광지 추천 리스트 가져오는거
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
// 지역 사진 가져오는거
export const getHomeRegionInfo = createAsyncThunk('/place/regionHomeInfo', async (data: any, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.get(`/place/regionInfo?region=${data.region}`, data);
		return response.data;
	} catch (error: any) {
		throw rejectWithValue(error.code);
	}
});
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
		changeLanguage: (state, {payload}) => {
			state.appLanguages = payload;
		},
	},
	extraReducers: builder => {
		builder.addCase(getHomeRegionInfo.fulfilled, (state, {payload}) => {
			state.homeRegionImage.photo = payload.photo;
			state.homeRegionImage.name = payload.name;
		});
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
	homeRegionImage: {name: string; photo: string};
	appLanguages: 'ko-KR' | 'en-US';
}

export const {
	setAppLoaded,
	setFirstLaunched,
	setPermission,
	setNopermission,
	setVersion,
	setNeedVersionUpdate,
	changeLanguage,
} = settingSlice.actions;
export default settingSlice.reducer;
