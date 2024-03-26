import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosAuth from '../api/api';
import {userSliceActions} from '../user/user.slice';
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
	searchList: [],
};

export const communitySlice = createSlice({
	name: 'community',
	initialState,
	reducers: {
		resetSearchList: state => {
			state.searchList = [];
		},
		resetPostList: state => {
			state.postList = [];
		},
		resetPostData: state => {
			Object.assign(state.postData, initialState.postData);
		},
		setPostTitle: (state, {payload}) => {
			state.postData.postTitle = payload;
		},
		setPostContent: (state, {payload}) => {
			state.postData.postContent = payload;
		},
		setPostImage: (state, {payload}) => {
			state.postData.postImage = payload;
		},
	},
	extraReducers: builder => {
		builder.addCase(getPostList.fulfilled, (state, {payload}) => {
			let copy = [...state.postList, ...payload];
			state.postList = copy;
		});
		builder.addCase(getSearchPostList.fulfilled, (state, {payload}) => {
			let copy = [...state.searchList, ...payload];
			state.searchList = copy;
		});
		builder.addCase(getOnePost.fulfilled, (state, {payload}) => {
			//console.log('게시글 하나 가져오기', payload);
			console.log('안녕', payload);
			state.postData = payload;
		});
	},
});
//검색 게시글 가져오기
export const getSearchPostList = createAsyncThunk(
	'/getSearchPostList',
	async (data: postListParameterType, {rejectWithValue}) => {
		try {
			const block = data.blockList.map(item => `&blockedUserIDs=${item}`);
			const response = await axiosAuth.get(
				`/post/postList?page=${data.page}&sort=${data.sort}${
					data.search != undefined && `&search=${data.search}`
				}${block.join('')}`,
			);
			return response.data;
		} catch (error) {
			console.log(error);
			throw rejectWithValue(error);
		}
	},
);
//게시글 목록 가져오기
export const getPostList = createAsyncThunk('/getPostList', async (data: postListParameterType, {rejectWithValue}) => {
	try {
		const block = data.blockList.map(item => `&blockedUserIDs=${item}`);
		const response = await axiosAuth.get(
			`/post/postList?page=${data.page}&sort=${data.sort}${
				data.search != undefined ? `&search=${data.search}` : ''
			}${block.join('')}`,
		);
		return response.data;
	} catch (error) {
		console.log(error);
		throw rejectWithValue(error);
	}
});

//게시글 하나 가져오기
export const getOnePost = createAsyncThunk('/getOnePost', async (data: {postId: string}, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.get(`/post/getOnePost?postId=${data.postId}`);
		//console.log('게시글 하나 가져오기가 실행됐을 때의 결과', response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		throw rejectWithValue(error);
	}
});

//게시글 저장하기
export const savePost = createAsyncThunk('/savePost', async (data: savePostType, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.post('/post/savePost', data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		throw rejectWithValue(error);
	}
});
//사용자 차단하기
export const blockUser = createAsyncThunk('/blockUser', async (data: {blockUserId: string}, thunkAPI) => {
	try {
		//thunkAPI.dispatch(userSliceActions.setBlockList(data.blockUserId));
		const response = await axiosAuth.patch('/user/blockUser', data);
		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		console.log(response.data);
		return response.data;
	} catch (error) {
		throw thunkAPI.rejectWithValue(error);
	}
});
//게시글 수정하기
export const updatePost = createAsyncThunk('/updatePost', async (data: updatePostType, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.patch('/post/updatePost', data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		throw rejectWithValue(error);
	}
});

//게시글 삭제하기
export const deletePost = createAsyncThunk('/deletePost', async (data: {postId: string}, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.delete('/post/deletePost', {data});
		console.log(response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		throw rejectWithValue(error);
	}
});

//좋아요 추가하기
export const clickLike = createAsyncThunk('/clickLike', async (data: {postId: string}, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.patch('/post/clickLike', data);
		console.log(response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		throw rejectWithValue(error);
	}
});

//좋아요 삭제하기  click 에서 대문자일수도
export const unclickLike = createAsyncThunk('/unclickLike', async (data: {postId: string}, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.patch('/post/unclickLike', data);
		console.log(response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		throw rejectWithValue(error);
	}
});

//댓글 추가하기
export const saveComment = createAsyncThunk('/saveComment', async (data: saveCommentType, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.patch('/post/saveComment', data);
		console.log(response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		throw rejectWithValue(error);
	}
});

//댓글 삭제하기
export const deleteComment = createAsyncThunk(
	'/deleteComment',
	async (data: {postId: string; commentId: string}, {rejectWithValue}) => {
		try {
			const response = await axiosAuth.patch('/post/deleteComment', data);
			console.log(response.data);

			// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
			return response.data;
		} catch (error) {
			throw rejectWithValue(error);
		}
	},
);
//게시글 신고하기
export const reportPost = createAsyncThunk('/reportPost', async (data: reportPostType, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.post('/managePost/reportPost', data);
		console.log(response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		throw rejectWithValue(error);
	}
});

//댓글 신고하기
export const reportComment = createAsyncThunk('/reportComment', async (data: reportCommentType, {rejectWithValue}) => {
	try {
		const response = await axiosAuth.post('/managePost/reportComment', data);
		console.log(response.data);

		// thunkAPI.dispatch(travelSliceActions.enrollPreset(response.request._response.resultData));
		return response.data;
	} catch (error) {
		throw rejectWithValue(error);
	}
});
export const communitySliceActions = communitySlice.actions;
export default communitySlice.reducer;

interface LiteState {
	postData: postDataType;
	postList: postListType[];
	searchList: postListType[];
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
	postWriterProfileImage: string;
}

export interface postListParameterType {
	page: number;
	sort: number;
	search?: string;
	blockList: string[];
}

export interface postListType {
	postId: string;
	postTitle: string;
	postWriter: string;
	postedAt: string;
	postContent: string;
	likerLength: number;
	commentLength: number;
	postWriterProfileImage: string;
	ImageLength: number;
	postCategory: number;
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
export interface reportCommentType extends reportPostType {
	commentId: string;
}

export interface saveCommentType {
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
	_id: string;
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
