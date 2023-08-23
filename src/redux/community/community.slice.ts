import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {axiosAuth} from '../travel-info/travel.slice';
const initialState: LiteState = {
	postData: {
		_id: '',
		postTitle: '',
		postContent: '',
		postImage: [],
		postWriter: '',
		postWriterUserId: '',
		postedAt: '',
		liker: [],
		comment: [],
	},
	postList: [],
};

export const communitySlice = createSlice({
	name: 'community',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(getPostList.fulfilled, (state, {payload}) => {
			console.log('게시글 목록 가져오기', payload);
			state.postList = payload;
		});
		builder.addCase(getOnePost.fulfilled, (state, {payload}) => {
			console.log('게시글 하나 가져오기', payload);
			state.postData = payload;
		});
	},
});

//게시글 목록 가져오기
export const getPostList = createAsyncThunk('/getPostList', async () => {
	try {
		const response = await axiosAuth.get('/post/postList');
		console.log(response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		console.log(error);
		return error;
	}
});

//게시글 하나 가져오기
export const getOnePost = createAsyncThunk('/getOnePost', async (data: {postId: string}, thunkAPI) => {
	try {
		const response = await axiosAuth.get(`/post/getOnePost?postId=${data.postId}`);
		console.log(response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		console.log(error);
		return error;
	}
});

//게시글 저장하기
export const savePost = createAsyncThunk('/savePost', async (data: savePostType, thunkAPI) => {
	try {
		const response = await axiosAuth.post('/post/savePost', data);
		console.log(response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		console.log(error);
		return error;
	}
});

//게시글 수정하기
export const updatePost = createAsyncThunk('/updatePost', async (data: updatePostType, thunkAPI) => {
	try {
		const response = await axiosAuth.patch('/post/updatePost', data);
		console.log(response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		console.log(error);
		return error;
	}
});

//게시글 삭제하기
export const deletePost = createAsyncThunk('/deletePost', async (data: {postId: string}, thunkAPI) => {
	try {
		const response = await axiosAuth.delete('/post/deletePost', {data});
		console.log(response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		console.log(error);
		return error;
	}
});

//좋아요 추가하기
export const clickLike = createAsyncThunk('/clickLike', async (data: {postId: string}, thunkAPI) => {
	try {
		const response = await axiosAuth.patch('/post/clickLike', data);
		console.log(response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		console.log(error);
		return error;
	}
});

//좋아요 삭제하기  click 에서 대문자일수도
export const unclickLike = createAsyncThunk('/unclickLike', async (data: {postId: string}, thunkAPI) => {
	try {
		const response = await axiosAuth.patch('/post/unclickLike', data);
		console.log(response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		console.log(error);
		return error;
	}
});

//댓글 추가하기
export const saveComment = createAsyncThunk('/saveComment', async (data: saveCommentType, thunkAPI) => {
	try {
		const response = await axiosAuth.patch('/post/saveComment', data);
		console.log(response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		console.log(error);
		return error;
	}
});

//댓글 삭제하기
export const deleteComment = createAsyncThunk(
	'/deleteComment',
	async (data: {postId: string; commentId: string}, thunkAPI) => {
		try {
			const response = await axiosAuth.patch('/post/deleteComment', data);
			console.log(response.data);

			// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
			return response.data;
		} catch (error) {
			console.log(error);
			return error;
		}
	},
);
//게시글 신고하기
export const reportPost = createAsyncThunk('/reportPost', async (data: reportPostType, thunkAPI) => {
	try {
		const response = await axiosAuth.post('/managePost/reportPost', data);
		console.log(response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		console.log(error);
		return error;
	}
});

//댓글 신고하기
export const reportComment = createAsyncThunk('/reportComment', async (data: reportCommentType, thunkAPI) => {
	try {
		const response = await axiosAuth.post('/managePost/reportComment', data);
		console.log(response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		console.log(error);
		return error;
	}
});
export const communitySliceActions = communitySlice.actions;
export default communitySlice.reducer;

interface LiteState {
	postData: postDataType;
	postList: postListType[];
}

interface postDataType {
	_id: string;
	postTitle: string;
	postContent: string;
	postImage: string[];
	postWriter: string;
	postWriterUserId: string;
	postedAt: string;
	liker: string[];
	comment: commentType[];
}

export interface postListType {
	postId: string;
	postTitle: string;
	postWriter: string;
	postedAt: string;
	postContent: string;
	likerLength: number;
	commentLength: number;
}

export interface updatePostType {
	postId: string;
	postTitle: string;
	postContent: string;
	postImage: string[];
}

export interface reportPostType {
	postId: string;
	reportReason: string;
	reportedAt: string;
	reportWriter: string;
}
interface reportCommentType extends reportPostType {
	commentId: string;
}

interface saveCommentType {
	postId: string;
	comment: {
		commentContent: string;
		commentedAt: string;
		commentWriter: string;
		commentWriterUserId: string;
		commentWriterProfile: string;
	};
}

export interface commentType {
	commentContent: string;
	commentedAt: string;
	commentWriter: string;
	commentWriterUserId: string;
	commentWriterProfile: string;
	postId: string;
}

export interface savePostType {
	postTitle: string;
	postContent: string;
	postImage: string[];
	postedAt: string;
}

interface reviewAndPointType {
	travelId: string;
	review: string;
	point: number;
	tendencyPoint: number[][];
}
