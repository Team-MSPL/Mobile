import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image, Text, Center, Box, ScrollView, Button, VStack, HStack} from 'native-base';
import {Touchable, TouchableOpacity, Linking, Alert} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {logout, updateFunctionToken, updateProfile, userSliceActions, userWithdraw} from '../../redux/user/user.slice';
export default function Payment({navigation}: any) {
	const {isLogin, userName, socialloginProvider, functionToken, userId, userProfileImage} = useAppSelector(
		state => state.userSlice,
	);

	const {anonymous} = useAppSelector(state => state.loginSlice);
	const dispatch = useAppDispatch();

	const changeInfo = () => {
		navigation.navigate('ChangeProfile');
	};
	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			<TouchableOpacity>
				<Text>1000원 결제! </Text>
			</TouchableOpacity>
		</ScrollView>
	);
}
