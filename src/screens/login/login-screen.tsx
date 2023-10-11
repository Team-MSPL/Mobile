import {API_ROUTE, Google_Signin_Key} from '@env';
import {appleAuth, appleAuthAndroid} from '@invertase/react-native-apple-authentication';

import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import * as KakaoLogin from '@react-native-seoul/kakao-login';

import jwtDecode from 'jwt-decode';
import {useEffect, useState} from 'react';
import {Animated} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import shortid from 'shortid';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {socialConnect} from '../../redux/user/login.slice';
import {userSliceActions} from '../../redux/user/user.slice';
import {colors} from '../../utill/colors';
import {HStack} from '../../utill/layout/layout';
import {SvgApple, SvgDanimText, SvgGoogle, SvgGuest, SvgKakao, SvgLoginLogo} from '../../utill/svg/svg';
interface tokenType {
	aud: string;
	auth_time: number;
	c_hash: string;
	email: string;
	email_verified: string;
	exp: number;
	iat: number;
	is_private_email: string;
	iss: string;
	nonce: string;
	nonce_supported: boolean;
	sub: string;
}

export default function LoginScreen({navigation}: any) {
	const goNext = () => {
		dispatch(userSliceActions.setAnonymous());
		navigation.replace('Tab');
	};
	const {isLogin, socialloginProvider, anonymousKeep} = useAppSelector(state => state.userSlice);
	useEffect(() => {
		socialloginProvider != 'anonymous' && isLogin && navigation.replace('Tab');
	}, []);

	// 랜덤으로 문자열 생성
	const getRandomString = (length: number) => {
		const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
		}
		return result;
	};

	const goAI = () => {
		navigation.navigate('LocalSearchAITest');
	};
	const dispatch = useAppDispatch();

	const kakaoLogin = async () => {
		try {
			await KakaoLogin.login();
			const userInfo = await KakaoLogin.getProfile();
			const data = {
				userName: userInfo.nickname,
				userProfileImage: userInfo.profileImageUrl,
				userToken: userInfo.id,
				loginProvider: 'kakao',
				signUpFlag: false,
			};
			const result = await dispatch(socialConnect(data)).unwrap();
			if (result == 202) {
				navigation.navigate('Join1', {
					userToken: userInfo.id,
					loginProvider: 'kakao',
					profileImage: userInfo.profileImageUrl,
					nickname: userInfo.nickname,
				});
			} else {
				anonymousKeep ? navigation.goBack() : navigation.replace('Tab');
			}
		} catch (err) {
			console.log(err);
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '카카오 로그인에 실패했습니다.',
				}),
			);
		}
	};

	const googleLogin = async () => {
		GoogleSignin.configure({
			webClientId: Google_Signin_Key,
		});
		try {
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();
			const data = {
				userName: userInfo.user.name,
				userProfileImage: userInfo.user.photo,
				userToken: userInfo.user.id,
				loginProvider: 'google',
				signUpFlag: false,
			};
			console.log('디비 주소에용', API_ROUTE);
			const result = await dispatch(socialConnect(data)).unwrap();
			if (result == 202) {
				navigation.navigate('Join1', {
					userToken: userInfo.user.id,
					loginProvider: 'google',
					profileImage: userInfo.user.photo,
					nickname: userInfo.user.name,
				});
			} else {
				navigation.replace('Tab');
			}
		} catch (error) {
			if (error === statusCodes.SIGN_IN_CANCELLED) {
				console.log('구글 로그인 취소됨', error);
				// user cancelled the login flow
			} else if (error === statusCodes.IN_PROGRESS) {
				console.log('구글 로그인 이미 실행 중', error);
				// operation (e.g. sign in) is in progress already
			} else if (error === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				console.log('구글 로그인 서비스 이용 불가 및 만료');
				// play services not available or outdated
			} else {
				console.log('구글 로그인 다른 에러 발생', error);
				// some other error happened
			}
		}
	};

	const appleLogin = async () => {
		try {
			if (appleAuth.isSupported) {
				console.log('ios다!!');
				const appleAuthRequestResponse = await appleAuth.performRequest({
					requestedOperation: appleAuth.Operation.LOGIN,
					//requestedScopes: [appleAuth.Scope.FULL_NAME],
				});
				// Ensure Apple returned a user identityToken
				if (!appleAuthRequestResponse.identityToken) {
					throw new Error('Apple Sign-In failed - no identify token returned');
				}
				const decodeToken: tokenType = jwtDecode(appleAuthRequestResponse.identityToken);
				const data = {
					userName: `김다님${shortid.generate()}`,
					userProfileImage: '../public/images/danim_logo3.png',
					userToken: decodeToken.sub,
					loginProvider: 'apple',
					signUpFlag: false,
				};
				console.log('디비 주소에용', API_ROUTE);
				const result = await dispatch(socialConnect(data)).unwrap();
				if (result == 202) {
					navigation.navigate('Join1', {
						userToken: decodeToken.sub,
						loginProvider: 'apple',
						profileImage: '../public/images/danim_logo3.png',
						nickname: `김다님${shortid.generate()}`,
					});
				} else {
					navigation.replace('Tab');
				}
			} else {
				console.log('안드로이드다!!');
				// 보안을 위해 state, nonce 랜덤으로 생성
				const rawNonce = getRandomString(20);
				const state = getRandomString(20);
				appleAuthAndroid.configure({
					clientId: 'DanimMobile.example.native.reactjs.org',
					redirectUri: 'https://danim-3439e.firebaseapp.com/__/auth/handler',
					responseType: appleAuthAndroid.ResponseType.ALL,
					//scope: appleAuthAndroid.Scope.NAME,
					nonce: rawNonce,
					state,
				});
				const response = await appleAuthAndroid.signIn();
				console.log(response);
				const decodeToken: tokenType = jwtDecode(response.id_token!);
				console.log('같아라!', decodeToken.sub);
				const data = {
					userName: `김다님${shortid.generate()}`,
					userProfileImage: '../public/images/danim_logo3.png',
					userToken: decodeToken.sub,
					loginProvider: 'apple',
					signUpFlag: false,
				};
				const result = await dispatch(socialConnect(data)).unwrap();
				if (result == 202) {
					navigation.navigate('Join1', {
						userToken: decodeToken.sub,
						loginProvider: 'apple',
						profileImage: '../public/images/danim_logo3.png',
						nickname: `김다님${shortid.generate()}`,
					});
				} else {
					navigation.replace('Tab');
				}

				// if (response.state === state) {
				// 	const credential = auth.AppleAuthProvider.credential(response.id_token!, rawNonce);
				// 	const userInfo = await auth().signInWithCredential(credential);
				// 	console.log('안드로이드로 애플 로그인 성공', userInfo.user);
				// 	const data = {
				// 		userName: `김다님${shortid.generate()}`,
				// 		userProfileImage: '../public/images/danim_logo.png',
				// 		userToken: userInfo.user.uid,
				// 		loginProvider: 'apple',
				// 		signUpFlag: false,
				// 	};
				// 	const result = await dispatch(socialConnect(data)).unwrap();
				// 	if (result == 202) {
				// 		navigation.navigate('Join1', {
				// 			userToken: userInfo.user.uid,
				// 			loginProvider: 'apple',
				// 			profileImage: '../public/images/danim_logo.png',
				// 			nickname: `김다님${shortid.generate()}`,
				// 		});
				// 	} else {
				// 		navigation.replace('Tab');
				// 	}
				// }
			}
		} catch (error) {
			console.error('애플 로그인 실패', error);
		}
	};

	const platforms = [
		{title: 'Google', color: 'white', image: <SvgGoogle />, onPress: googleLogin},
		{title: 'Kakao', color: colors.reviewBackground, image: <SvgKakao />, onPress: kakaoLogin},
		{title: 'Apple', color: 'black', image: <SvgApple />, onPress: appleLogin},
	];

	const [view, setView] = useState(0);
	const viewList = [
		require('../../../public/images/login1.png'),
		require('../../../public/images/login1.png'),
		require('../../../public/images/login1.png'),
		require('../../../public/images/login1.png'),
	];
	const [backgroundImageIndex, setBackgroundImageIndex] = useState(0);
	const [fadeAnim] = useState(new Animated.Value(1));

	const startBackgroundAnimation = () => {
		const backgroundImages = [
			require('../../../public/images/login1.png'),
			require('../../../public/images/login1.png'),
			require('../../../public/images/login1.png'),
			require('../../../public/images/login1.png'),
		];
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 4000,
			// easing: Easing.linear,
			useNativeDriver: false, // useNativeDriver를 false로 설정
		}).start(() => {
			// 애니메이션 완료 후 호출되는 콜백
			console.log(fadeAnim);
			console.log('헤헤');
			setBackgroundImageIndex(prevIndex => (prevIndex + 1) % backgroundImages.length);
			// 다음 애니메이션 시작
			fadeAnim.setValue(0); // fadeAnim 초기화
		});
	};

	useEffect(() => {
		const interval = setInterval(startBackgroundAnimation, 5000);
		return () => {
			console.log('에ㅔ에에에에에');
			clearInterval(interval);
		};
	}, []);
	return (
		<SafeAreaView>
			<BackgroundImage source={viewList[backgroundImageIndex]}>
				<LoginSCreenContainer>
					<TitleTextContainer>
						<LoginText>여행 일정을 이렇게</LoginText>
						<TextContainer>
							<LoginText>쉽게 짤 수 있</LoginText>
							<SvgDanimText color='white' />
						</TextContainer>
					</TitleTextContainer>
					<SvgLoginLogo color='white' />
					<CircleContainer>
						{platforms.map((platform, index) => (
							<LongCircleButton
								key={index}
								bgColor={platform.color}
								onPress={() => {
									platform.onPress();
								}}>
								<LogoHStack>
									<LogoContainer>{platform.image}</LogoContainer>
									<LogoText color={platform.title == 'Apple' ? 'white' : 'black'}>
										{platform.title} {platform.title == 'Apple' ? '로 로그인' : '아이디로 로그인'}
									</LogoText>
								</LogoHStack>
							</LongCircleButton>
						))}
						<LongCircleButton bgColor={colors.selectButton} onPress={goNext}>
							<LogoHStack>
								<LogoContainer>
									<SvgGuest />
								</LogoContainer>
								<LogoText color={'white'}>로그인없이 앱 둘러보기</LogoText>
							</LogoHStack>
						</LongCircleButton>
					</CircleContainer>
					<HStack>
						{/* {platforms.map((platform, index) => (
						<CircleButton
							key={index}
							bgColor={platform.color}
							onPress={() => {
								platform.onPress();
							}}>
							{platform.image}
						</CircleButton>
					))} */}
						{/* <AppleButton
						buttonStyle={AppleButton.Style.WHITE}
						buttonType={AppleButton.Type.SIGN_IN}
						style={{
							width: 160, // You must specify a width
							height: 45, // You must specify a height
						}}
						onPress={() => appleLogin()}
					/> */}
					</HStack>
				</LoginSCreenContainer>
			</BackgroundImage>
		</SafeAreaView>
	);
}

const LoginSCreenContainer = styled.View`
	width: 100%;
	padding: 20px;
	align-items: center;
	justify-content: center;
	margin: 10% 0% 0% 0%;
`;
const BackgroundImage = styled.ImageBackground`
	width: 100%;
	height: 100%;
`;
const TextContainer = styled(HStack)`
	align-items: flex-start;
`;
const TitleTextContainer = styled.View`
	align-items: flex-start;
	margin: 0% 0% 15% 0%;
`;
const LoginText = styled.Text`
	font-size: 23px;
	font-weight: bold;
	color: white;
	margin: 0px 10px 0px 0px;
`;

const CircleButton = styled.TouchableOpacity<{bgColor: string}>`
	width: 50px;
	height: 50px;
	border-radius: 99px;
	padding: 10px;
	align-items: center;
	justify-content: center;
	margin: 0px 10px 0px 10px;
	background-color: ${props => props.bgColor};
`;
const CircleContainer = styled.View`
	width: 100%;
	margin: 10% 0% 0% 0%;
`;
const LongCircleButton = styled(CircleButton)`
	width: 100%;
	margin: 5% 0% 0% 0%;
	elevation: 3;
	shadow-color: black;
	shadow-opacity: 0.5;
	align-items: center;
`;
const LogoText = styled.Text<{color: string}>`
	font-size: 15px;
	color: ${props => props.color};
`;
const LogoContainer = styled.View`
	position: absolute;
	left: 10px;
`;
const LogoTextContainer = styled.View`
	width: 80%;
`;
const LogoHStack = styled(HStack)`
	width: 100%;
	justify-content: center;
`;
