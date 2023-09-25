import {Touchable, TouchableOpacity, Linking, Alert} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {logout, updateFunctionToken, updateProfile, userSliceActions, userWithdraw} from '../../redux/user/user.slice';
import {MainContainer, MainText} from '../../utill/layout/layout';
export default function Payment({navigation}: any) {
	const {isLogin, userName, socialloginProvider, functionToken, userId, userProfileImage} = useAppSelector(
		state => state.userSlice,
	);

	const {anonymous} = useAppSelector(state => state.loginSlice);
	const dispatch = useAppDispatch();

	const changeInfo = () => {
		navigation.navigate('ChangeProfile');
	};
	const handlePayment = (e: number) => {
		Alert.alert(`국민 950002-00-251241 ${e}원 보내세요.`);
	};
	return (
		<MainContainer>
			<MainText>출석시 하루마다 무료로 1개씩 추가됩니다! </MainText>
			{paymentViewList.map((item, idx) => (
				<TouchableOpacity
					key={idx}
					style={{marginVertical: 10}}
					onPress={() => {
						handlePayment(item.pay);
					}}>
					<MainText>{item.title}</MainText>
					<MainText>{item.pay}원 입니다</MainText>
				</TouchableOpacity>
			))}
		</MainContainer>
	);
}
const paymentViewList = [
	{title: '토큰 1개', pay: 100},
	{title: '토큰 10개', pay: 1000},
	{title: '토큰 50개', pay: 5000},
	{title: '토큰 100개', pay: 10000},
];
