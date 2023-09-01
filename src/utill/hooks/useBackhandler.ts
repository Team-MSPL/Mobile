import {useEffect} from 'react';
import {Alert, BackHandler} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
export const useBackHandler = () => {
	const navigation = useNavigation();
	const dispatch = useAppDispatch();
	const exitApp = () => {
		BackHandler.exitApp();
	};
	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused()) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '앱 종료',
						modalSubTitle: '앱을 종료하시겠습니까?',
						modalFunction: exitApp,
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
