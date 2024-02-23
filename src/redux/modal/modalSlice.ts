import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
const initialState: LiteState = {
	// modalLeft: () => {},
	modalBottom: false, //모달 왼쪽 버튼이 있을지없을지 보통은 '취소' 버튼임
	modalOpen: false, // 모달 오픈할지 안할지
	modalTitle: '', // 모달의 title
	modalSubTitle: '', //  title 밑에 있는 작은 글씨
	modalFunction: () => {}, //모달 오른쪽 버튼을 눌렀을때 실행될 함수.
	modalTopText: '확인',
	modalBottomText: '취소',
	modalBottomFunctionUse: false,
	modalBottomFunction: () => {},
};

export const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		setOpenModal: (state, {payload}) => {
			state.modalOpen = true;
			state.modalBottom = payload.modalBottom ?? false;
			state.modalTitle = payload.modalTitle;
			state.modalSubTitle = payload.modalSubTitle ?? '';
			state.modalFunction = payload.modalFunction ?? (() => {});
			state.modalTopText = payload.modalTopText ?? '확인';
			state.modalBottomText = payload.modalBottomText ?? '취소';
			state.modalBottomFunctionUse = payload.modalBottomFunctionUse ?? false;
			state.modalBottomFunction = payload.modalBottomFunction ?? (() => {});
		},
		setCloseModal: state => {
			state.modalOpen = false;
			state.modalBottom = false;
			// state.modalLeft = () => {};
			state.modalSubTitle = '';
			state.modalBottomFunctionUse = false;
		},
	},
});
export const modalSliceActions = modalSlice.actions;
export default modalSlice.reducer;

interface LiteState {
	modalOpen: boolean;
	modalBottom: boolean;
	//modalLeft: () => void | Promise<void>;
	modalTitle: string;
	modalSubTitle: string;
	modalFunction: () => void | Promise<void>;
	modalTopText: string;
	modalBottomText: string;
	modalBottomFunctionUse: boolean;
	modalBottomFunction: () => void | Promise<void>;
}
