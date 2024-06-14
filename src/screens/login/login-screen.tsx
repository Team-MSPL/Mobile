import {Google_Signin_Key} from '@env';
import {appleAuth, appleAuthAndroid} from '@invertase/react-native-apple-authentication';

import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import * as KakaoLogin from '@react-native-seoul/kakao-login';

import jwtDecode from 'jwt-decode';
import {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import shortid from 'shortid';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {socialConnect} from '../../redux/user/login.slice';
import {colors} from '../../utill/colors';
import {HStack, PretendardBoldText, PretendardVariableText} from '../../utill/layout/layout';
import {SvgApple, SvgGoogle, SvgKakao, SvgLoginLogo} from '../../utill/svg/svg';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
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
	const {isLogin, fcmToken} = useAppSelector(state => state.userSlice);
	useEffect(() => {
		if (isLogin) {
			navigation.reset({index: 0, routes: [{name: 'Tab'}]});
		}
	}, [isLogin]);
	// 랜덤으로 문자열 생성
	const getRandomString = (length: number) => {
		const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
		}
		return result;
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
				fcmToken: fcmToken,
				version: 2,
			};
			const result = await dispatch(socialConnect(data)).unwrap();
			if (result == 202) {
				navigation.navigate('Join1', {
					userToken: userInfo.id,
					loginProvider: 'kakao',
					profileImage: userInfo.profileImageUrl,
					nickname: userInfo.nickname,
				});
			}
		} catch (err) {
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
				fcmToken: fcmToken,
				version: 2,
			};
			const result = await dispatch(socialConnect(data)).unwrap();
			if (result == 202) {
				navigation.navigate('Join1', {
					userToken: userInfo.user.id,
					loginProvider: 'google',
					profileImage: userInfo.user.photo,
					nickname: userInfo.user.name,
				});
			}
		} catch (error) {
			if (error === statusCodes.SIGN_IN_CANCELLED) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '네트워크 연결이 불안정합니다',
						modalSubTitle: '확인후 다시 시도해주세요',
					}),
				);
				// user cancelled the login flow
			} else if (error === statusCodes.IN_PROGRESS) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '네트워크 연결이 불안정합니다',
						modalSubTitle: '확인후 다시 시도해주세요',
					}),
				);
				// operation (e.g. sign in) is in progress already
			} else if (error === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '네트워크 연결이 불안정합니다',
						modalSubTitle: '확인후 다시 시도해주세요',
					}),
				);
				// play services not available or outdated
			} else {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '네트워크 연결이 불안정합니다',
						modalSubTitle: '확인후 다시 시도해주세요',
					}),
				);
				// some other error happened
			}
		}
	};

	const appleLogin = async () => {
		try {
			if (appleAuth.isSupported) {
				const appleAuthRequestResponse = await appleAuth.performRequest({
					requestedOperation: appleAuth.Operation.LOGIN,
				});
				// Ensure Apple returned a user identityToken
				if (!appleAuthRequestResponse.identityToken) {
					throw new Error('Apple Sign-In failed - no identify token returned');
				}
				const decodeToken: tokenType = jwtDecode(appleAuthRequestResponse.identityToken);
				const data = {
					userName: `나그네${shortid.generate()}`,
					userProfileImage: 'https://danim.me/square_logo.png',
					userToken: decodeToken.sub,
					loginProvider: 'apple',
					signUpFlag: false,
					fcmToken: fcmToken,
					version: 2,
				};
				const result = await dispatch(socialConnect(data)).unwrap();
				if (result == 202) {
					navigation.navigate('Join1', {
						userToken: decodeToken.sub,
						loginProvider: 'apple',
						profileImage: 'https://danim.me/square_logo.png',
						nickname: `나그네${shortid.generate()}`,
					});
				}
			} else {
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
				const decodeToken: tokenType = jwtDecode(response.id_token!);
				const data = {
					userName: `나그네${shortid.generate()}`,
					userProfileImage: 'https://danim.me/square_logo.png',
					userToken: decodeToken.sub,
					loginProvider: 'apple',
					signUpFlag: false,
					fcmToken: fcmToken,
					version: 2,
				};
				const result = await dispatch(socialConnect(data)).unwrap();
				if (result == 202) {
					navigation.navigate('Join1', {
						userToken: decodeToken.sub,
						loginProvider: 'apple',
						profileImage: 'https://danim.me/square_logo.png',
						nickname: `나그네${shortid.generate()}`,
					});
				}
			}
		} catch (error) {
			console.error('애플 로그인 실패', error);
		}
	};

	const platforms = [
		{
			title: 'Google',
			color: 'white',
			image: <SvgGoogle width={widthPercentage(24)} height={widthPercentage(24)} />,
			onPress: googleLogin,
		},
		{
			title: 'Kakao',
			color: colors.reviewBackground,
			image: <SvgKakao width={widthPercentage(18)} height={widthPercentage(18)} />,
			onPress: kakaoLogin,
		},
		{
			title: 'Apple',
			color: 'black',
			image: <SvgApple width={widthPercentage(24)} height={widthPercentage(24)} />,
			onPress: appleLogin,
		},
	];

	return (
		<BackgroundImage source={require('../../../public/images/login-image.png')}>
			<SafeAreaView>
				<LoginSCreenContainer>
					<SvgLoginLogo color='white' width={widthPercentage(151)} height={heightPercentage(44)} />
					<PretendardBoldText size={12} lineHeight={18} color={colors.backgroundWhite}>
						당신을 위한 여행 길잡이,다님
					</PretendardBoldText>
				</LoginSCreenContainer>
				<CircleContainer>
					{platforms.map((platform, index) => (
						<LongCircleButton
							key={index}
							bgColor={platform.color}
							onPress={() => {
								platform.onPress();
							}}>
							<LogoHStack>
								{platform.image}
								<PretendardVariableText
									size={14}
									lineHeight={21.6}
									color={platform.title == 'Apple' ? 'white' : 'black'}>
									{platform.title} {platform.title == 'Apple' ? '로 로그인' : '아이디로 로그인'}
								</PretendardVariableText>
							</LogoHStack>
						</LongCircleButton>
					))}
				</CircleContainer>
			</SafeAreaView>
		</BackgroundImage>
	);
}

const LoginSCreenContainer = styled.View`
	width: 100%;
	align-items: center;
	justify-content: center;
	top: ${heightPercentage(271)}px;
`;
const BackgroundImage = styled.ImageBackground`
	width: 100%;
	height: 100%;
`;
const CircleContainer = styled.View`
	width: ${widthPercentage(326)}px;
	justify-content: center;
	position: absolute;
	top: ${heightPercentage(511)}px;
	align-self: center;
	gap: ${heightPercentage(10)}px;
`;
const LongCircleButton = styled.TouchableOpacity<{bgColor: string}>`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(52)}px;
	background-color: ${props => props.bgColor};
	align-items: center;
	border-radius: 12px;
	justify-content: center;
`;
const LogoHStack = styled(HStack)`
	width: 100%;
	justify-content: center;
`;
