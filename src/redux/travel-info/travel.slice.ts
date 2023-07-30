import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import moment, {Moment} from 'moment';
import {API_ROUTE, NAVER_API_KEY, NAVER_API_KEY_id, GOOGLE_API_KEY, KAKAO_REST_API_KEY} from '@env';
const initialState: LiteState = {
	region: [],
	cityName: '',
	day: [],
	nDay: 0,
	Place: {name: '', lat: 0, lng: 0, category: 4, takenTime: 30, imageUrl: ''},
	accommodations: [],
	essentialPlaces: [],
	distance: 0,
	transit: 0,
	tendency: [[]],
	timeLimitArray: [10, 20],
	minuteLimitArray: [0, 0],
	season: [false, false, false, false],
	presetDatas: [[[]]],
	timetable: [[]],
	moveTimeList: [],
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
		Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
	},
});

//교통 시간 구하는 거
export const getDrivingDuration = createAsyncThunk(
	'/li',
	async (data: {start: string; goal: string; wayPoint: string}, thunkAPI) => {
		try {
			console.log('하위요', data.start, data.goal, data.wayPoint);
			const response = await axiosAuth.get(
				`https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${data.start}&goal=${
					data.goal
				}&waypoints=${`${data.wayPoint}`}&option=trafast`,
				{
					headers: {
						'X-NCP-APIGW-API-KEY-ID': NAVER_API_KEY_id,
						'X-NCP-APIGW-API-KEY': NAVER_API_KEY,
					},
				},
			);
			console.log('q', response.data.route.trafast[0].summary);
			console.log('q', response.data.route.trafast[0].summary.duration);
			console.log(Math.floor(response.data.route.trafast[0].summary.duration / 1000 / 60));
			return response.data.route.trafast[0].summary;
		} catch (error) {
			return console.log(error);
		}
	},
);

// export const getTransitDuration = createAsyncThunk('/li', async (data: any, thunkAPI) => {
// 	try {
// 		console.log('하위요');
// 		const response = await axiosGoogle.get(
// 			`/directions/json?origin=37.5125,127.102778&destination=37.5586545,126.7944739&mode=transit&language=ko&waypoints=37.5118,127.0992|37.5768,126.9783&key=${GOOGLE_API_KEY}`,
// 		);
// 		//`/directions/json?origin=${'37.5125,127.102778'}&destination=${'37.5586545,126.7944739'}&mode=transit&language=ko&waypoints=via%3A-37.81223%2C144.96254%7Cvia%3A-34.92788%2C138.60008&key=${GOOGLE_API_KEY}`,

// 		console.log('하위', response.data);
// 		console.log(Math.floor(response.data.routes[0].legs[0].duration.value / 60));
// 		return response.data;
// 	} catch (error) {
// 		return console.log(error);
// 	}
// });

//장소 정보 얻어오는거
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

// 탐테에서 눌렀을때 검색이 아니라 이름으로 장소 찾는 거
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

//카카오 식당,카페 등 추천 장소 얻는 거
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
		enrollPreset: (state, {payload}) => {
			state.presetDatas = payload;
		},
		enrollTimetable: (state, {payload}) => {
			state.timetable = state.presetDatas[payload];
		},
	},
	extraReducers: builder => {
		builder.addCase(getDrivingDuration.fulfilled, (state, {payload}) => {
			let list: number[] = [];
			payload.waypoints && (list = payload.waypoints.map((item, idx) => item.duration));
			list.push(payload.goal.duration);
			state.moveTimeList.push(list);
			console.log('니는 안덥나', state.moveTimeList);
		});
	},
});

export const travelSliceActions = travelSlice.actions;
export default travelSlice.reducer;

interface LiteState {
	region: string[];
	cityName: string;
	day: Moment[];
	nDay: number;
	Place: PlaceType;
	accommodations: PlaceType[];
	essentialPlaces: EssentialPlaceType[];
	distance: number;
	transit: number;
	tendency: [boolean[]];
	timeLimitArray: number[];
	minuteLimitArray: number[];
	season: boolean[];
	presetDatas: [[TimetableType[]]];
	timetable: [TimetableType[]];
	moveTimeList: [number[]] | [];
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

export interface TimetableType {
	category: number;
	concept: number[];
	lat: number;
	lng: number;
	name: string;
	partner: number[];
	play: number[];
	popular: number;
	season: number[];
	takenTime: number;
	tour: number[];
	x?: number;
	y?: number;
}
