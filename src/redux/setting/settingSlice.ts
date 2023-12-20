import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

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
			state.updateStoreUrl = payload.updateStoreUrl;
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
