import {createSlice} from '@reduxjs/toolkit';
import moment from 'moment';

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

	//시작시간,끝시간
};

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
