import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosAuth from '../api/api';
export const hikingSelectList = [
	['계곡을 따라', '가볍게 걷기 좋은', '원점회귀'],
	['봄', '여름', '가을', '겨울'],
];
const initialState: LiteState = {
	mountainName: '소백산국립공원(경북)',
	selectList: hikingSelectList.map(item => {
		return Array(item.length).fill(0);
	}),
	selectDifficulty: [],
	hikingList: [],
};

export const hikingRecommendSlice = createSlice({
	name: 'hiking',
	initialState,
	reducers: {
		enrollHikingTendency: (state, {payload}) => {
			state.selectList = payload;
		},
		enrollDifficulty: (state, {payload}) => {
			state.selectDifficulty = payload;
		},
		reset: state => {
			Object.assign(state, initialState);
		},
	},
	extraReducers: builder => {
		builder.addCase(hikingSearch.fulfilled, (state, {payload}) => {
			let sort = payload.sort((a, b) => a.difficulty - b.difficulty);
			state.hikingList = sort;
		});
	},
});
//탐방 코스 추천 알고리즘
export const hikingSearch = createAsyncThunk('/hikingSearch/run', async (data: any, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.post(`/hikingSearch/run`, data);
		return response.data;
	} catch (error: any) {
		throw rejectWithValue(error.code);
	}
});
//탐방 코스 리뷰 추가하기
export const hikingSaveReview = createAsyncThunk('/hikingSearch/saveReview', async (data: any, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.patch(`/hikingSearch/saveReview`, data);
		return response.data;
	} catch (error: any) {
		throw rejectWithValue(error.code);
	}
});

//탐방 코스 리뷰 삭제하기
export const hikingDeleteReview = createAsyncThunk(
	'/hikingSearch/deleteReview',
	async (data: any, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.patch(`/hikingSearch/deleteReview`, data);
			return response.data;
		} catch (error: any) {
			throw rejectWithValue(error.code);
		}
	},
);
export const hikingRecommendSliceActions = hikingRecommendSlice.actions;
export default hikingRecommendSlice.reducer;

interface LiteState {
	mountainName: string;
	selectList: number[][];
	selectDifficulty: number[];
	hikingList: hikingType[];
}
interface hikingType {
	name: string;
	tendency: string[];
	course: string;
	difficulty: number;
	distance: number;
	infoContent: string;
	phoneNum: string;
	takenTime: number;
	webSite: string;
	photo: string[];
	type: number[];
	season: number[];
	review: [
		{
			reviewContent: string;
			reviewUserToken: string;
			reviewPhotoList: string[];
		},
	];
}
