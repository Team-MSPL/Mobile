import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';
import {useAppDispatch} from '../redux';
import {modalSliceActions} from '../redux/modal/modalSlice';
import {userSliceActions} from '../redux/user/user.slice';
export default function ViewPager() {
	const dispatch = useAppDispatch();
	const handleFirstLaunch = async () => {
		dispatch(userSliceActions.setIsFirstLaunch('false'));
		await AsyncStorage.setItem('isFirstLaunch', 'true');
	};
	useEffect(() => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '다님',
				modalSubTitle: '앱을 다운받아주셔서 감사합니다.',
				modalFunction: handleFirstLaunch,
			}),
		);
	}, []);
}
