import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {colors} from '../../colors';
import {BackgroundGray, Center, PretendardSemiBoldText} from '../../layout/layout';
import {heightPercentage, widthPercentage} from '../../layout/responsive-size';
import PrimaryButton from '../primary-button';
import {userSliceActions} from '../../../redux/user/user.slice';

export default function NeedLogin({navigation}: any) {
	const exceptionKeys = ['isFirstLaunch', 'noPermission'];
	const dispatch = useAppDispatch();
	const handleLogin = async () => {
		await AsyncStorage.getAllKeys().then(allKeys => {
			const removeList = allKeys.filter(k => !exceptionKeys.some(ek => ek === k));
			AsyncStorage.multiRemove(removeList);
		});
		dispatch(userSliceActions.reset());
		navigation.reset({index: 0, routes: [{name: 'LoginScreen'}]});
	};
	return (
		<Center backgroundColor='white'>
			<PretendardSemiBoldText size={15} color='black' lineHeight={20} marginBottom={heightPercentage(10)}>
				로그인한 사용자만 이용 가능합니다
			</PretendardSemiBoldText>
			<PrimaryButton
				label='로그인하러 가기'
				onPress={handleLogin}
				width={widthPercentage(200)}
				height={heightPercentage(50)}
				backgroundColor={colors.Primary}
				textColor='black'></PrimaryButton>
		</Center>
	);
}
