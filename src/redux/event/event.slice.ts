import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosAuth from '../api/api';

const name = 'event';
const initialState: EventState = {
	eventState: null,
	eventList: [],
	eventLink: '',
	cooperationState: false,
	cooperationType: '', //inbound국내 outbound 해외
};

const eventSlice = createSlice({
	name,
	initialState,
	reducers: {
		setEventState: (state, {payload}) => {
			state.eventState = payload;
		},
		setCooperationState: (state, {payload}) => {
			state.cooperationState = payload.status;
			state.cooperationType = payload.type;
		},
	},
	extraReducers: builder => {
		builder.addCase(getEventList.fulfilled, (state, {payload}) => {
			state.eventList = payload.eventList;
		});
	},
});
//이벤트 확인하기
export const getEventList = createAsyncThunk('/event/eventList', async (_, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.get(`/event/eventList`);
		return response.data;
	} catch (error: any) {
		throw rejectWithValue(error.code);
	}
});

interface EventState {
	eventState: boolean | null;
	eventList: EventListType[];
	eventLink: string;
	cooperationState: boolean | null;
	cooperationType: string;
}

interface EventListType {
	_id: string;
	eventImage: string;
	eventEndDate: string;
	eventLink: string;
	eventBannerImage: string;
}

export const eventSliceActions = eventSlice.actions;
export default eventSlice.reducer;
