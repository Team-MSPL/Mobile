import {GOOGLE_API_KEY} from '@env';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {axiosGoogle} from './travel.slice';
import axiosAuth from '../api/api';
const initialState: LiteState = {
	tendency: [[]],
	distance: 0,
	popularity: [],
	lat: 0,
	lng: 0,
	recommendList: [{name: '', photo: '', takenDay: 0, tendency: [''], topPopularPlaceList: {name: '', photo: ''}}],
};

export const regionRecommendSlice = createSlice({
	name: 'loading',
	initialState,
	reducers: {
		enrollTendency: (state, {payload}) => {
			state.tendency = payload;
		},
		enrollDistanceAndLatLng: (state, {payload}) => {
			state.distance = payload.distance;
			state.lat = payload.lat;
			state.lng = payload.lng;
		},
		enrollPopularity: (state, {payload}) => {
			state.popularity = payload;
		},
	},
	extraReducers: builder => {
		builder.addCase(regionSearch.fulfilled, (state, {payload}) => {
			console.log(payload);
			state.recommendList = payload;
			//state.myTravelList = payload;
		});
	},
});
//여행 지역 추천 알고리즘
export const regionSearch = createAsyncThunk('/regionSearch', async (data: any, {rejectWithValue}) => {
	try {
		console.log('왔엉');
		const response = await axiosAuth.post(`/regionSearch/run`, data);

		console.log(response.data);
		return response.data;
	} catch (error: any) {
		throw rejectWithValue(error.code);
	}
});
//이름으로 좌표 얻는거
export const geocoding = createAsyncThunk('/googleDetailApi', async (data: any, {rejectWithValue}) => {
	try {
		console.log(data.region);
		const response = await axiosGoogle.get(
			`/geocode/json?address=${encodeURIComponent(data.region)}&language=ko&key=${GOOGLE_API_KEY}`,
		);

		//제로리절트 처리하기
		console.log(response.data);
		return response.data;
	} catch (error: any) {
		throw rejectWithValue(error.code);
	}
});

//좌표로 이름 얻는거
export const reverseGeocoding = createAsyncThunk('/googleDetailApi', async (data: any, {rejectWithValue}) => {
	try {
		const response = await axiosGoogle.get(
			`/geocode/json?address=${data.latlng}&language=ko&key=${GOOGLE_API_KEY}`,
		);
		//제로리절트 처리하기
		console.log(response.data);
		return response.data;
	} catch (error: any) {
		throw rejectWithValue(error.code);
	}
});

export const regionRecommendSliceActions = regionRecommendSlice.actions;
export default regionRecommendSlice.reducer;

interface LiteState {
	tendency: boolean[][];
	distance: number;
	popularity: number[];
	lat: number;
	lng: number;
	recommendList: RegionRecommend[];
}

interface RegionRecommend {
	name: string;
	photo: string;
	takenDay: number;
	tendency: string[];
	topPopularPlaceList: {name: string; photo: string};
}
