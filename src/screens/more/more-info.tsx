import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image, Text, Box} from 'native-base';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {logout, updateFunctionToken, userSliceActions, userWithdraw} from '../../redux/user/user.slice';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {MainContainer, VStack, HStack} from '../../utill/layout/layout';
export default function MoreInfo({navigation}: any) {
	const {userName, socialloginProvider, functionToken, userId, userProfileImage} = useAppSelector(
		state => state.userSlice,
	);

	const {anonymous} = useAppSelector(state => state.loginSlice);
	const dispatch = useAppDispatch();
	const exceptionKeys = ['isFirstLaunch'];
	const goLogout = async () => {
		await AsyncStorage.getAllKeys().then(allKeys => {
			const removeList = allKeys.filter(k => !exceptionKeys.some(ek => ek === k));
			AsyncStorage.multiRemove(removeList);
		});
		dispatch(userSliceActions.reset());
		navigation.replace('LoginScreen');
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '로그아웃에 성공했습니다.',
			}),
		);
	};
	const goWithdraw = async () => {
		try {
			let signUpFirebase = socialloginProvider == 'kakao' || socialloginProvider == 'apple';
			const data = {userId: userId, signUpFirebase: !signUpFirebase};
			dispatch(userWithdraw(data));
			await AsyncStorage.getAllKeys().then(allKeys => {
				const removeList = allKeys.filter(k => !exceptionKeys.some(ek => ek === k));
				AsyncStorage.multiRemove(removeList);
			});
			dispatch(userSliceActions.reset());
			navigation.replace('LoginScreen');
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '회원탈퇴가 완료됐습니다.',
				}),
			);
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '회원 탈퇴 중 에러가 발생했습니다.',
				}),
			);
		}
	};
	useBackHandler();
	const changeInfo = () => {
		navigation.navigate('ChangeProfile');
	};
	const goPayment = () => {
		navigation.navigate('Payment');
	};
	const goTerms = () => {
		navigation.navigate('Terms');
	};
	const goPolicy = () => {
		navigation.navigate('PolicyMain');
	};
	const goCrack = () => {
		dispatch(updateFunctionToken({functionToken: 100}));
	};
	const handleInquire = () => {
		dispatch(modalSliceActions.setOpenModal({modalTitle: '운스한테 문의하삼유'}));
	};

	return (
		<MainContainer>
			<Box>
				<HStack>
					<Image
						source={{uri: userProfileImage == '' ? 'https://danim.me/lee.jpeg' : userProfileImage}}
						style={{width: 100, height: 100}}></Image>
					<Text>
						{userName} 님 반갑고 {socialloginProvider == 'anonymous' ? '익명' : socialloginProvider}{' '}
						로그인임
					</Text>
				</HStack>
			</Box>
			<Box>
				{socialloginProvider != 'anonymous' && (
					<VStack>
						<MainText>계정</MainText>
						<TouchableOpacity onPress={() => {}} style={{marginVertical: 10}}>
							<Text>너님 토큰 갯수{functionToken}</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={goPayment} style={{marginVertical: 10}}>
							<Text>토큰 구매하쉴?</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={changeInfo} style={{marginVertical: 10}}>
							<Text>정보 변경이요</Text>
						</TouchableOpacity>
					</VStack>
				)}

				<VStack>
					<MainText>이용안내</MainText>
					<TouchableOpacity onPress={() => {}} style={{marginVertical: 10}}>
						<Text>공지사항</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {}} style={{marginVertical: 10}}>
						<Text>이벤트 모아보기</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={handleInquire} style={{marginVertical: 10}}>
						<Text>문의하기</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={goPolicy} style={{marginVertical: 10}}>
						<Text>서비스 이용약관</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={goTerms} style={{marginVertical: 10}}>
						<Text>개인정보 처리방침</Text>
					</TouchableOpacity>
					<Text>앱버전 0.0</Text>
				</VStack>
				<VStack>
					<MainText>기타</MainText>
					{socialloginProvider != 'anonymous' && (
						<TouchableOpacity
							onPress={() => {
								dispatch(
									modalSliceActions.setOpenModal({
										modalTitle: '회원 탈퇴 하시겠습니까?',
										modalFunction: goWithdraw,
										modalLeft: true,
									}),
								);
							}}
							style={{marginVertical: 10}}>
							<Text>회원탈퇴</Text>
						</TouchableOpacity>
					)}

					<TouchableOpacity
						onPress={() => {
							dispatch(
								modalSliceActions.setOpenModal({
									modalTitle: '로그 아웃 하시겠습니까?',
									modalFunction: goLogout,
									modalLeft: true,
								}),
							);
						}}
						style={{marginVertical: 10}}>
						<Text>로그아웃</Text>
					</TouchableOpacity>
				</VStack>
			</Box>
			<TouchableOpacity onPress={goCrack} style={{marginVertical: 10}}>
				<Text>크랙버전</Text>
			</TouchableOpacity>
		</MainContainer>
	);
}

const MainText = styled.Text`
	font-size: 20px;
	font-weight: bold;
	color: black;
`;
