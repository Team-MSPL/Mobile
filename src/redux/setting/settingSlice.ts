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
		photo: 'https://storage.googleapis.com/place-photo-bucket/%EC%A0%84%EA%B5%AD%20%EC%97%AC%ED%96%89%20%EC%A7%80%EC%97%AD%20ver2/%EA%B2%BD%EB%B6%81%20%EA%B2%BD%EC%A3%BC%EC%8B%9C.jpg?Expires=2016695378&GoogleAccessId=firebase-adminsdk-9ud51%40danim-3439e.iam.gserviceaccount.com&Signature=UDssfYh7%2BiQHLzDlabvqoGLbHWQ%2Bu1AuaS2Bc5a9%2F%2BuS4RG5gw0Q6eZpiuB3akLfyj66JX%2B5Fd7OQVx%2F7CfGO%2FiitMrfHoMqXOj6HwNJyx%2F854DcvkivfdOrvYP2hO2NHxlAD3y%2B4EWHTA0euZICDqhDxc62%2Bl3lhPKm%2Boj8MG3PUfOmfdOrY2TadIONlm6QcQRzzXqoIcwbHNeNoU6j5m0Hg05NhvBF0XPwn2znsY1RqpSJkyegQRsc6P9osKKKk1Fm7ISdT0wOFuumHt5VZ52lF6VaOaMffSZPmYIqPINqvOO5A3ZYoGsDOoh9nsTVgHPejT9pvxCk8C5J%2FTfIDQ%3D%3D',
		name: '경북 경주시',
	},
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
// 지역 사진 가져오는거
export const getHomeRegionInfo = createAsyncThunk('/place/regionHomeInfo', async (data: any, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.get(`/place/regionInfo?region=${data.region}`, data);
		return response.data;
	} catch (error: any) {
		console.log(error);
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
}

export const {setAppLoaded, setFirstLaunched, setPermission, setNopermission, setVersion, setNeedVersionUpdate} =
	settingSlice.actions;
export default settingSlice.reducer;
