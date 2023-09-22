import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {userSliceActions, userWithdraw} from '../../redux/user/user.slice';
import {colors} from '../../utill/colors';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {Divider, MainContainer} from '../../utill/layout/layout';
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
	const handleInquire = () => {
		dispatch(modalSliceActions.setOpenModal({modalTitle: '운스한테 문의하삼유'}));
	};
	const goLogin = () => {
		navigation.replace('LoginScreen');
	};
	const useInfo = [
		{title: '공지사항', function: () => console.log('qwe')},
		{title: '도움말', function: () => console.log('qwe')},
		{title: '문의하기', function: () => console.log('qwe')},
		{title: '이용약관', function: goPolicy},
		{title: '개인정보 처리 방침', function: goTerms},
	];
	return (
		<MainContainer>
			<ProfileContainer>
				<ProfileImage
					source={{
						uri: userProfileImage == '' ? 'https://danim.me/lee.jpeg' : userProfileImage,
					}}></ProfileImage>
				<ProfileNameText>
					{userName} {socialloginProvider == 'anonymous' ? '익명' : socialloginProvider}
				</ProfileNameText>
				{socialloginProvider != 'anonymous' && (
					<ProfileChangeContainer onPress={changeInfo}>
						<ProfileChangeText>프로필 편집</ProfileChangeText>
					</ProfileChangeContainer>
				)}
			</ProfileContainer>

			{/* {socialloginProvider != 'anonymous' && (
				<>
					<ProfileDivider />
					<SettingContainer>
						<TitleText>계정</TitleText>
						<SettingElement
							onPress={() => {
								console.log('노노');
							}}>
							<SettingElementText>토큰 갯수 {functionToken} 개</SettingElementText>
						</SettingElement>

						<SettingElement onPress={goPayment}>
							<SettingElementText>토큰 구매하기</SettingElementText>
						</SettingElement>
					</SettingContainer>
				</>
			)} */}
			<ProfileDivider />
			<SettingContainer>
				<TitleText>이용안내</TitleText>
				{useInfo.map((item, idx) => (
					<SettingElement key={idx} onPress={item.function}>
						<SettingElementText>{item.title}</SettingElementText>
					</SettingElement>
				))}
			</SettingContainer>
			<ProfileDivider />
			<SettingContainer>
				<TitleText>앱버전 0.0</TitleText>
				{socialloginProvider != 'anonymous' ? (
					<>
						<SettingElement
							onPress={() => {
								dispatch(
									modalSliceActions.setOpenModal({
										modalTitle: '로그 아웃 하시겠습니까?',
										modalFunction: goLogout,
										modalLeft: true,
									}),
								);
							}}>
							<LogoutText>로그아웃</LogoutText>
						</SettingElement>

						<SettingElement
							onPress={() => {
								dispatch(
									modalSliceActions.setOpenModal({
										modalTitle: '회원 탈퇴 하시겠습니까?',
										modalFunction: goWithdraw,
										modalLeft: true,
									}),
								);
							}}>
							<LogoutText>회원탈퇴</LogoutText>
						</SettingElement>
					</>
				) : (
					<SettingElement
						onPress={() => {
							dispatch(
								modalSliceActions.setOpenModal({
									modalTitle: '로그인 페이지로 이동하시겠습니까?',
									modalFunction: goLogin,
									modalLeft: true,
								}),
							);
						}}>
						<LogoutText>로그인</LogoutText>
					</SettingElement>
				)}
			</SettingContainer>
		</MainContainer>
	);
}

const ProfileContainer = styled.View`
	align-items: center;
	justify-content: center;
	width: 100%;
`;
const ProfileImage = styled.Image`
	width: 100px;
	height: 100px;
	border-radius: 10px;
`;
const ProfileNameText = styled.Text`
	font-size: 18px;
	font-weight: bold;
	color: black;
`;

const ProfileChangeContainer = styled.TouchableOpacity`
	padding: 10px 15px 10px 15px;
	border-radius: 30px;
	background-color: ${colors.selectButton};
	margin: 10px 0px 20px 0px;
`;

const ProfileChangeText = styled.Text`
	font-size: 16px;
	font-weight: bold;
	color: white;
`;
const SettingContainer = styled.View`
	width: 100%;
`;
const ProfileDivider = styled(Divider)`
	background-color: #e0e0e0;
	height: 1px;
`;
const TitleText = styled.Text`
	font-size: 13px;
	color: black;
	font-weight: 900;
	margin: 5px 0px 20px 0px;
`;
const SettingElementText = styled.Text`
	font-size: 16px;
	font-weight: bold;
	color: black;
`;
const SettingElement = styled.TouchableOpacity`
	margin: 12px 0px 12px 0px;
`;
const LogoutText = styled.Text`
	font-size: 15px;
	color: red;
`;
