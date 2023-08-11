import {GOOGLE_API_KEY} from '@env';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {axiosGoogle} from './travel.slice';
const initialState: LiteState = {
	tendency: [[]],
	distance: 0,
	popularity: [],
	lat: 0,
	lng: 0,
};

export const RegionRecommendSlice = createSlice({
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
});

//이름으로 좌표 얻는거
export const geocoding = createAsyncThunk('/googleDetailApi', async (data: any, thunkAPI) => {
	try {
		console.log(data.region);
		const response = await axiosGoogle.get(
			`/geocode/json?address=${encodeURIComponent(data.region)}&language=ko&key=${GOOGLE_API_KEY}`,
		);

		//제로리절트 처리하기
		console.log(response.data);
		return response.data;
	} catch (error) {
		return console.log(error);
	}
});

//좌표로 이름 얻는거
export const reverseGeocoding = createAsyncThunk('/googleDetailApi', async (data: any, thunkAPI) => {
	try {
		const response = await axiosGoogle.get(
			`/geocode/json?address=${data.latlng}&language=ko&key=${GOOGLE_API_KEY}`,
		);
		//제로리절트 처리하기
		console.log(response.data);
		return response.data;
	} catch (error) {
		return console.log(error);
	}
});

export const RegionRecommendSliceActions = RegionRecommendSlice.actions;
export default RegionRecommendSlice.reducer;

interface LiteState {
	tendency: boolean[][];
	distance: number;
	popularity: number[];
	lat: number;
	lng: number;
}
