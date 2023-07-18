import {createSlice} from '@reduxjs/toolkit';

const initialState: LiteState = {
	region: [],
	cityName: '',
	day: [],
	nDay: 0,
	Place: {name: '', lat: 0, lng: 0, category: 4, takenTime: 30},
	accommodations: [],
	essentialPlaces: [],
	distance: 0,
	transit: 0,
	tendency: [],
	timeLimitArray: [10, 20],

	//시작시간,끝시간
};

export const travelSlice = createSlice({
	name: 'travel',
	initialState,
	reducers: {
		selectRegion: (state, {payload}) => {
			state.region = payload;
		},
		setRegion: state => {
			state.region = [];
		},
		setCityName: (state, {payload}) => {
			state.cityName = payload;
		},
		selectDay: (state, {payload}) => {
			state.day = payload;
		},
		setDay: (state, {payload}) => {
			state.day = payload;
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
	},
});

export const travelSliceActions = travelSlice.actions;
export default travelSlice.reducer;

interface LiteState {
	region: string[];
	cityName: string;
	day: DayType[];
	nDay: number;
	Place: PlaceType;
	accommodations: PlaceType[];
	essentialPlaces: EssentialPlaceType[];
	distance: number;
	transit: number;
	tendency: boolean[];
	timeLimitArray: number[];
}

interface DayType {
	day: string;
	minute: number;
	hours: number;
	timestamp: number;
	month: number;
}

interface PlaceType {
	name: string;
	lat: number;
	lng: number;
	category: number;
	takenTime: number;
}

export interface EssentialPlaceType {
	day: number;
	name: string;
	lat: number;
	lng: number;
	category: number;
	takenTime: number;
	id: string;
}
