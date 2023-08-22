import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image, Text, Center, Box, ScrollView, Button, VStack, HStack} from 'native-base';
import {Touchable, TouchableOpacity, Linking, Alert} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {logout, updateFunctionToken, updateProfile, userSliceActions, userWithdraw} from '../../redux/user/user.slice';
export default function MoreInfo({navigation}: any) {
	const {isLogin, userName, socialloginProvider, functionToken, userId, userProfileImage} = useAppSelector(
		state => state.userSlice,
	);

	const {anonymous} = useAppSelector(state => state.loginSlice);
	const dispatch = useAppDispatch();

	const goLogout = async () => {
		await AsyncStorage.getAllKeys().then(removeList => AsyncStorage.multiRemove(removeList)); //TODO 로그아웃시 지금은 다 날려버림
		dispatch(userSliceActions.reset());
		navigation.replace('LoginScreen');
		Alert.alert('로그아웃 성공이요');
	};
	const goWithdraw = async () => {
		try {
			let signUpFirebase = socialloginProvider == 'kakao' || socialloginProvider == 'apple';
			const data = {userId: userId, signUpFirebase: !signUpFirebase};
			console.log('사인업', signUpFirebase);
			dispatch(userWithdraw(data));
			await AsyncStorage.getAllKeys().then(removeList => AsyncStorage.multiRemove(removeList)); //TODO 로그아웃시 지금은 다 날려버림
			dispatch(userSliceActions.reset());
			navigation.replace('LoginScreen');
			Alert.alert('탈퇴 성공이요');
		} catch (err) {
			Alert.alert('회원탈퇴중 에러요');
		}
	};

	const changeInfo = () => {
		navigation.navigate('ChangeProfile');
	};
	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			{isLogin || anonymous ? (
				<Box>
					<HStack alignItems='center'>
						<Image source={{uri: userProfileImage}} style={{width: 100, height: 100}}></Image>
						<Text>
							{userName ?? '익명'} 님 반갑고 {socialloginProvider ?? '익명'} 로그인임
						</Text>
					</HStack>
				</Box>
			) : (
				<TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
					<Text>로그인ㄱ</Text>
				</TouchableOpacity>
			)}
			<Box>
				<VStack>
					<Text bold fontSize='xl'>
						계정
					</Text>
					<TouchableOpacity
						onPress={() => dispatch(updateFunctionToken({functionToken: 4}))}
						style={{marginVertical: 10}}>
						<Text>너님 토큰 갯수{functionToken}</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={changeInfo} style={{marginVertical: 10}}>
						<Text>정보 변경이요</Text>
					</TouchableOpacity>
				</VStack>

				<VStack>
					<Text bold fontSize='xl'>
						이용안내
					</Text>
					<TouchableOpacity onPress={() => {}} style={{marginVertical: 10}}>
						<Text>공지사항</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {}} style={{marginVertical: 10}}>
						<Text>이벤트 모아보기</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => {}} style={{marginVertical: 10}}>
						<Text>문의하기</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => {}} style={{marginVertical: 10}}>
						<Text>서비스 이용약관</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {}} style={{marginVertical: 10}}>
						<Text>개인정보 처리방침</Text>
					</TouchableOpacity>
					<Text>앱버전 0.0</Text>
				</VStack>
				<VStack>
					<Text bold fontSize='xl'>
						기타
					</Text>
					<TouchableOpacity onPress={goWithdraw} style={{marginVertical: 10}}>
						<Text>회원탈퇴</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={goLogout} style={{marginVertical: 10}}>
						<Text>로그아웃</Text>
					</TouchableOpacity>
				</VStack>
			</Box>
		</ScrollView>
	);
}
