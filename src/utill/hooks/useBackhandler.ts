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
		exit: {title: '앱 종료', subTitle: '앱을 종료하시겠습니까?', handleFunction: exitApp},
		popToTop: {
			title: '추천이 종료됩니다.',
			subTitle: '그래도 나가시겠습니까?',
			handleFunction: goPopToTop,
		},
		stop: {title: 'AI가 추천을 진행 중 입니다. 조금만 기다려주세요!', subTitle: '', handleFunction: notFunction},
	};
	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused()) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: typeList[type].title,
						modalSubTitle: typeList[type].subTitle,
						modalFunction: typeList[type].handleFunction,
						modalLeft: true,
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
