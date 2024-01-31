import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
const initialState: LiteState = {
	// modalLeft: () => {},
	modalLeft: false, //모달 왼쪽 버튼이 있을지없을지 보통은 '취소' 버튼임
	modalOpen: false, // 모달 오픈할지 안할지
	modalTitle: '', // 모달의 title
	modalSubTitle: '', //  title 밑에 있는 작은 글씨
	modalFunction: () => {}, //모달 오른쪽 버튼을 눌렀을때 실행될 함수.
	modalRightText: '확인',
	modalLeftText: '취소',
	modalLeftFunctionUse: false,
	modalLeftFunction: () => {},
};

export const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		setOpenModal: (state, {payload}) => {
			state.modalOpen = true;
			state.modalLeft = payload.modalLeft ?? false;
			state.modalTitle = payload.modalTitle;
			state.modalSubTitle = payload.modalSubTitle ?? '';
			state.modalFunction = payload.modalFunction ?? (() => {});
			state.modalRightText = payload.modalRightText ?? '확인';
			state.modalLeftText = payload.modalLeftText ?? '취소';
			state.modalLeftFunctionUse = payload.modalLeftFunctionUse ?? false;
			state.modalLeftFunction = payload.modalLeftFunction ?? (() => {});
		},
		setCloseModal: state => {
			state.modalOpen = false;
			state.modalLeft = false;
			// state.modalLeft = () => {};
			state.modalSubTitle = '';
			state.modalLeftFunctionUse = false;
		},
	},
});
export const modalSliceActions = modalSlice.actions;
export default modalSlice.reducer;

interface LiteState {
	modalOpen: boolean;
	modalLeft: boolean;
	//modalLeft: () => void | Promise<void>;
	modalTitle: string;
	modalSubTitle: string;
	modalFunction: () => void | Promise<void>;
	modalRightText: string;
	modalLeftText: string;
	modalLeftFunctionUse: boolean;
	modalLeftFunction: () => void | Promise<void>;
}
