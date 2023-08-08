import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
const initialState: LiteState = {
	postInfo: [],
};

export const communitySlice = createSlice({
	name: 'community',
	initialState,
	reducers: {
		setPostInfo: (state, {payload}) => {
			state.postInfo = payload;
		},
	},
});

export const communitySliceActions = communitySlice.actions;
export default communitySlice.reducer;

interface LiteState {
	postInfo: postInfoType[];
}

interface postInfoType {
	postTitle: string | null;
	postContent: string | null;
	postImageList: string[] | null;
	posterToken: string | null;
	createdAt: Date | null;
}
