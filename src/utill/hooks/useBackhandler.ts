import {useEffect} from 'react';
import {Alert, BackHandler} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
export const useBackHandler = ({type}: BackHandlerType) => {
	const navigation = useNavigation();
	const dispatch = useAppDispatch();
	const exitApp = () => {
		BackHandler.exitApp();
	};
	const goPopToTop = () => {
		navigation.popToTop();
	};
	const notFunction = () => {};
	const typeList = {
		exit: {
			title: '앱 종료',
			subTitle: '앱을 종료하시겠습니까?',
			handleFunction: exitApp,
			modalTopText: '종료하기',
			modalBottomText: '둘러보기',
			modalBottomFunctionUse: false,
			modalBottomFunction: () => {},
		},
		popToTop: {
			title: '저장되지 않았어요',
			subTitle: `홈으로 이동시 지역 추천이 종료돼요.\n일정 선택 후에 종료해야 저장할 수 있어요.`,
			handleFunction: () => {},
			modalTopText: '선택하러 가기',
			modalBottomText: '종료하기',
			modalBottomFunctionUse: true,
			modalBottomFunction: goPopToTop,
		},
		stop: {
			title: 'AI가 추천을 진행 중 입니다. 조금만 기다려주세요!',
			subTitle: '',
			handleFunction: notFunction,
			modalTopText: '기다릴게요!',
			modalBottomText: '대기할게요!',
			modalBottomFunctionUse: false,
			modalBottomFunction: () => {},
		},
	};
	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused()) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: typeList[type].title,
						modalSubTitle: typeList[type].subTitle,
						modalFunction: typeList[type].handleFunction,
						modalTopText: typeList[type].modalTopText,
						modalBottomText: typeList[type].modalBottomText,
						modalBottomFunctionUse: typeList[type]?.modalBottomFunctionUse,
						modalBottomFunction: typeList[type].modalBottomFunction,
					}),
				);

				return true;
			}
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, []);
};
interface BackHandlerType {
	type: 'exit' | 'popToTop' | 'stop';
}
