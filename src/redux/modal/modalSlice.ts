import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
const initialState: LiteState = {
	modalBottom: false, //모달 왼쪽 버튼이 있을지없을지 보통은 '취소' 버튼임
	modalOpen: false, // 모달 오픈할지 안할지
	modalTitle: '', // 모달의 title
	modalSubTitle: '', //  title 밑에 있는 작은 글씨
	modalFunction: () => {}, //모달 윗쪽 버튼을 눌렀을때 실행될 함수.
	modalTopText: '확인', //모달 윗쪽 텍스트
	modalBottomText: '취소', //모달 아래쪽 텍스트
	modalBottomFunctionUse: false, //모달 아래쪽 버튼을 눌렀을때 함수가 실행할건지
	modalBottomFunction: () => {}, //모달 아래쪽 버튼 눌렀을때 실행될 함수
	modalSingleUse: false, // 모달 아래쪽 없애고 하나만 쓰는거
	modalConfetti: false, //빵빠레
	modalConfettiFlag: false, //빵빠레 플레그
	modalTextSize: 20,
	travleMedic: false,
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
			state.modalSingleUse = payload.modalSingleUse ?? false;
			state.modalConfetti = payload.modalConfetti ?? false;
			state.modalTextSize = payload.modalTextSize ?? 20;
			state.travleMedic = payload.travleMedic ?? false;
		},
		setCloseModal: state => {
			state.modalOpen = false;
			state.modalBottom = false;
			state.modalSubTitle = '';
			state.modalBottomFunctionUse = false;
		},
		setConfettiFlag: state => {
			state.modalConfettiFlag = true;
		},
	},
});
export const modalSliceActions = modalSlice.actions;
export default modalSlice.reducer;

interface LiteState {
	modalOpen: boolean;
	modalBottom: boolean;
	modalTitle: string;
	modalSubTitle: string;
	modalFunction: () => void | Promise<void>;
	modalTopText: string;
	modalBottomText: string;
	modalBottomFunctionUse: boolean;
	modalBottomFunction: () => void | Promise<void>;
	modalSingleUse: boolean;
	modalConfetti: boolean;
	modalConfettiFlag: boolean;
	modalTextSize: number;
	travleMedic: boolean;
}
