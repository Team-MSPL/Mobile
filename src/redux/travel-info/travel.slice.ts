import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import {API_ROUTE, NAVER_API_KEY, NAVER_API_KEY_id, GOOGLE_API_KEY, KAKAO_API_KEY} from '@env';
const initialState: LiteState = {
	region: [],
	cityName: '',
	day: [moment().format('YY-MM-DD'), moment().format('YY-MM-DD')],
	nDay: 0,
	Place: {name: '', lat: 0, lng: 0, category: 4, takenTime: 30, imageUrl: ''},
	accommodations: [],
	essentialPlaces: [],
	distance: 0,
	transit: 0,
	tendency: [],
	timeLimitArray: [10, 20],
	minuteLimitArray: [0, 0],
	season: [false, false, false, false],
};

const axiosAuth = axios.create({
	baseURL: API_ROUTE,
	headers: {'content-type': 'application/json'},
});

const axiosGoogle = axios.create({
	baseURL: 'https://maps.googleapis.com/maps/api',
	headers: {'content-type': 'application/json'},
});
const axiosKakao = axios.create({
	baseURL: 'https://dapi.kakao.com/v2/local/search',
	headers: {
		'content-type': 'application/json',
		Authorization: `KakaoAK 1639f743957ac1b957ecc29b73f380cb`,
	},
});

export const getDrivingDuration = createAsyncThunk('/li', async (data: any, thunkAPI) => {
	try {
		console.log('하위요');
		const response = await axiosAuth.get(
			`https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${'126.9403619316089,37.50743514849087'}&goal=${'126.96076545753868,37.50717338607686'}&waypoints=${'127.09922913614956,37.51180542624659|126.97836638977465,37.57682519650363'}&option=trafast`,
			{
				headers: {
					'X-NCP-APIGW-API-KEY-ID': NAVER_API_KEY_id,
					'X-NCP-APIGW-API-KEY': NAVER_API_KEY,
				},
			},
		);
		console.log('q', response.data.route.trafast[0].summary);
		console.log(Math.floor(response.data.route.trafast[0].summary.duration / 1000 / 60));
		return response.data;
	} catch (error) {
		return console.log(error);
	}
});

export const getTransitDuration = createAsyncThunk('/li', async (data: any, thunkAPI) => {
	try {
		console.log('하위요');
		const response = await axiosGoogle.get(
			`/directions/json?origin=${'37.5125,127.102778'}&destination=${'37.5586545,126.7944739'}&mode=transit&language=ko&key=${GOOGLE_API_KEY}`,
		);
		console.log(Math.floor(response.data.routes[0].legs[0].duration.value / 60));
		return response.data;
	} catch (error) {
		return console.log(error);
	}
});

export const googleDetailApi = createAsyncThunk('/li', async (data: any, thunkAPI) => {
	try {
		const response = await axiosGoogle.get(
			`/place/details/json?place_id=${data.placeId}&fields=photos%2Cname%2Crating%2Creviews%2Ceditorial_summary&language=ko&key=${GOOGLE_API_KEY}`,
		);
		console.log('q', response.data.result);
		//제로리절트 처리하기
		return response.data;
	} catch (error) {
		return console.log(error);
	}
});
export const googleKeywordApi = createAsyncThunk('/li', async (data: any, thunkAPI) => {
	try {
		console.log('하위요');
		const response = await axiosGoogle.get(
			`/place/textsearch/json?query=${data.name}%20main%20street&location=${data.lng}%2C${data.lat}&language=ko&radius=10000&key=${GOOGLE_API_KEY}`,
		);
		// const q = await dispatch(googleKeywordApi());
		// const qwe = await dispatch(googleDetailApi({placeId: q.payload.results[0].place_id}));
		// console.log(qwe.payload.result);
		// console.log(response.data.results[0].place_id);
		//제로리절트 처리하기
		return response.data;
	} catch (error) {
		return console.log(error);
	}
});

export const recommendApi = createAsyncThunk('/li', async (data: any, thunkAPI) => {
	try {
		console.log('하위요');
		const response = await axiosKakao.get(
			`/category.json?category_group_code=FD6&x=126.94098402134308&y=37.50739041068636&radius=2000`,
		);
		console.log(response.data);
		// const q = await dispatch(googleKeywordApi());
		// const qwe = await dispatch(googleDetailApi({placeId: q.payload.results[0].place_id}));
		// console.log(qwe.payload.result);
		// console.log(response.data.results[0].place_id);
		//제로리절트 처리하기
		return response.data;
	} catch (error) {
		return console.log(error);
	}
});

// export const googleImageApi = createAsyncThunk('/li', async (data: any, thunkAPI) => {
// 	try {
// 		console.log('하위요');
// 		const response = await axiosGoogle.get(
// 			`/place/photo?maxwidth=400&photoreference=${data.photoReference}&key=${GOOGLE_API_KEY}`,
// 		);
// 		console.log(response.data.results[0].place_id);
// 		//제로리절트 처리하기
// 		return response.data;
// 	} catch (error) {
// 		return console.log(error);
// 	}
// });

// export const tourApiTest = createAsyncThunk('/li', async (data: any, thunkAPI) => {
// 	try {
// 		console.log('하위요');
// 		const response = await axiosAuth.get(
// 			`http://apis.data.go.kr/B551011/KorService1/searchKeyword1?MobileOS=AND&MobileApp=Danim&serviceKey=J7laKTTThB5SZdBdab6YA4Nam%2BgRrYc%2FXdqAzSQ%2FDUhLxMWFSUxBVbrn6WDpvTauz4oW2phb3ojdk9YmlZMPww%3D%3D&keyword=롯데월드타워&contentTypeId=12`,
// 		);
// 		console.log(response.data);
// 		return response.data;
// 	} catch (error) {
// 		return console.log(error);
// 	}
// });
// export const tourTourApiTest = createAsyncThunk('/li', async (data: any, thunkAPI) => {
// 	try {
// 		console.log('하위ㅇ요');
// 		const response = await axiosAuth.get(
// 			`http://apis.data.go.kr/B551011/KorService1/detailInfo1?MobileOS=AND&MobileApp=Danim&serviceKey=J7laKTTThB5SZdBdab6YA4Nam%2BgRrYc%2FXdqAzSQ%2FDUhLxMWFSUxBVbrn6WDpvTauz4oW2phb3ojdk9YmlZMPww%3D%3D&contentId=2003909&contentTypeId=12`,
// 		);
// 		console.log(response.data);
// 		return response.data;
// 	} catch (error) {
// 		return console.log(error);
// 	}
// });

export const travelSlice = createSlice({
	name: 'travel',
	initialState,
	reducers: {
		reset: state => {
			Object.assign(state, initialState);
		},
		selectRegion: (state, {payload}) => {
			state.region = payload;
		},
		setCityName: (state, {payload}) => {
			state.cityName = payload;
		},
		setNDay: (state, {payload}) => {
			state.nDay = payload;
		},
		enrollPlace: (state, {payload}) => {
			state.Place = payload;
		},
		enrollAccommodations: (state, {payload}) => {
			state.accommodations = payload;
		},
		enrollessentialPlaces: (state, {payload}) => {
			state.essentialPlaces = payload;
		},
		enrollDistance: (state, {payload}) => {
			state.distance = payload;
		},
		enrollTransit: (state, {payload}) => {
			state.transit = payload;
		},
		enrollTendency: (state, {payload}) => {
			state.tendency = payload;
		},
		enrollTimeLimitArray: (state, {payload}) => {
			state.timeLimitArray = payload;
		},
		enrollMinuteLimitArray: (state, {payload}) => {
			state.minuteLimitArray = payload;
		},
		setTimeAndMinute: (state, {payload}) => {
			state.timeLimitArray = payload.time;
			state.minuteLimitArray = payload.minute;
		},
		enrollDayInfo: (state, {payload}) => {
			state.day = payload.day;
			state.nDay = payload.nDay;
			state.accommodations = payload.accommodations;
			state.season = payload.season;
		},
	},
	// extraReducers: builder => {
	// 	builder.addCase(googleKeywordApi.fulfilled, (state, {payload}) => {
	// 		console.log('하');
	// 		googleDetailApi({placeId: payload.results[0].place_id});
	// 	});
	// },
});

export const travelSliceActions = travelSlice.actions;
export default travelSlice.reducer;

interface LiteState {
	region: string[];
	cityName: string;
	day: string[];
	nDay: number;
	Place: PlaceType;
	accommodations: PlaceType[];
	essentialPlaces: EssentialPlaceType[];
	distance: number;
	transit: number;
	tendency: boolean[][];
	timeLimitArray: number[];
	minuteLimitArray: number[];
	season: boolean[];
}

interface PlaceType {
	name: string;
	lat: number;
	lng: number;
	category: number;
	takenTime: number;
	imageUrl: string;
}

export interface EssentialPlaceType {
	day: number;
	name: string;
	lat: number;
	lng: number;
	category: number;
	takenTime: number;
	id: string;
	imageUrl: string;
}
