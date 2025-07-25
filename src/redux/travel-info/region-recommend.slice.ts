import {GOOGLE_API_KEY} from '@env';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {axiosGoogle} from './travel.slice';
import axiosAuth from '../api/api';
export const regionTendencyList = [
	{
		list: ['혼자여행', '커플 여행', '우정 여행', '가족 여행', '효도 여행', '어린 자녀와'],
	},
	{
		list: ['힐링', '활동적인', '배움이 있는', '맛있는', '교통이 편한', '알뜰한'],
	},
	{
		list: ['레저 스포츠', '산책', '드라이브코스', '이색체험', '쇼핑', '시티투어', '역사 여행'],
	},
	{
		list: ['바다', '산', '자연경관', '문화시설', '사진 명소', '전통'],
	},
	{
		list: ['봄', '여름', '가을', '겨울'],
	},
];
const initialState: LiteState = {
	regionTendency: regionTendencyList.map(item => {
		return Array(item.list.length).fill(0);
	}), //성향
	distance: 0,
	popularity: [100, 100],
	lat: 0,
	lng: 0,
	recommendList: [{name: '', photo: '', takenDay: 0, tendency: [''], topPopularPlaceList: {name: '', photo: ''}}],
	checKStep: 0,
};

export const regionRecommendSlice = createSlice({
	name: 'loading',
	initialState,
	reducers: {
		enrollRegionTendency: (state, {payload}) => {
			state.regionTendency = payload;
		},
		enrollDistanceAndLatLng: (state, {payload}) => {
			state.distance = payload.distance;
			state.lat = payload.lat;
			state.lng = payload.lng;
		},
		enrollPopularity: (state, {payload}) => {
			state.popularity = payload;
		},
		enrollCheckStep: (state, {payload}) => {
			state.checKStep = payload;
		},
		reset: state => {
			Object.assign(state, initialState);
		},
	},
	extraReducers: builder => {
		builder.addCase(regionSearch.fulfilled, (state, {payload}) => {
			let sort = payload.sort((a, b) => a.takenDay - b.takenDay);
			state.recommendList = sort;
			//state.myTravelList = payload;
		});
	},
});
//여행 지역 추천 알고리즘
export const regionSearch = createAsyncThunk('/regionSearch', async (data: any, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.post(`/regionSearch/run`, data);
		return response.data;
	} catch (error: any) {
		throw rejectWithValue(error.code);
	}
});
//이름으로 좌표 얻는거
export const geocoding = createAsyncThunk('/googleDetailApi', async (data: any, {rejectWithValue}) => {
	try {
		const response = await axiosGoogle.get(
			`/geocode/json?address=${encodeURIComponent(data.region)}&language=ko&key=${GOOGLE_API_KEY}`,
		);
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
		return response.data;
	} catch (error: any) {
		throw rejectWithValue(error.code);
	}
});

export const regionRecommendSliceActions = regionRecommendSlice.actions;
export default regionRecommendSlice.reducer;

interface LiteState {
	regionTendency: number[][];
	distance: number;
	popularity: number[];
	lat: number;
	lng: number;
	recommendList: RegionRecommend[];
	checKStep: number;
}

interface RegionRecommend {
	name: string;
	photo: string;
	takenDay: number;
	tendency: string[];
	topPopularPlaceList: {name: string; photo: string};
}
