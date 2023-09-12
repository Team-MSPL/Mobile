import {Google_Signin_Key} from '@env';
import {AppleButton, appleAuth, appleAuthAndroid} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';

import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import {Button, Center, HStack, Heading, Image, Text} from 'native-base';

import {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {socialConnect} from '../../redux/user/login.slice';
import {userSliceActions} from '../../redux/user/user.slice';

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
			console.log('띠영', userInfo);
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
		} catch {
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
					requestedScopes: [appleAuth.Scope.FULL_NAME],
				});
				// Ensure Apple returned a user identityToken
				if (!appleAuthRequestResponse.identityToken) {
					throw new Error('Apple Sign-In failed - no identify token returned');
				}
				const name = appleAuthRequestResponse.fullName;
				const fullName = `${name?.familyName}${name?.givenName}`;
				// Create a Firebase credential from the response
				const {identityToken, nonce} = appleAuthRequestResponse;
				const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
				// Sign the user in with the credential
				const authenticate = await auth().signInWithCredential(appleCredential);
				const userInfo = {...authenticate.user, displayName: fullName};
				console.log('애플 로그인 성공', userInfo);
				const data = {
					userName: userInfo.displayName,
					userProfileImage: '../public/images/danim_logo.png',
					userToken: userInfo.uid,
					loginProvider: 'apple',
					signUpFlag: false,
				};
				const result = await dispatch(socialConnect(data)).unwrap();
				if (result == 202) {
					navigation.navigate('Join1', {
						userToken: userInfo.uid,
						loginProvider: 'apple',
						profileImage: '../public/images/danim_logo.png',
						nickname: userInfo.displayName,
					});
					console.log('이름, 사진', userInfo.displayName, userInfo.photoURL);
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
					scope: appleAuthAndroid.Scope.NAME,
					nonce: rawNonce,
					state,
				});
				const response = await appleAuthAndroid.signIn();

				if (response.state === state) {
					const credential = auth.AppleAuthProvider.credential(response.id_token!, rawNonce);
					const userInfo = await auth().signInWithCredential(credential);
					console.log('안드로이드로 애플 로그인 성공', userInfo.user);
					const data = {
						userName: userInfo.user.displayName,
						userProfileImage: '../public/images/danim_logo.png',
						userToken: userInfo.user.uid,
						loginProvider: 'apple',
						signUpFlag: false,
					};
					const result = await dispatch(socialConnect(data)).unwrap();
					if (result == 202) {
						navigation.navigate('Join1', {
							userToken: userInfo.user.uid,
							loginProvider: 'apple',
							profileImage: '../public/images/danim_logo.png',
							nickname: userInfo.user.displayName,
						});
						console.log('이름, 사진', userInfo.user.displayName, userInfo.user.photoURL);
					}
				}
			}
		} catch (error) {
			console.error('애플 로그인 실패', error);
		}
	};

	const platforms = [
		{color: 'yellow.300', image: require('../../../public/images/kakao_logo.png'), onPress: kakaoLogin},
		{color: 'white', image: require('../../../public/images/google_logo.png'), onPress: googleLogin},
		// {color: 'black', image: require('../../../public/images/apple_logo.png'), onPress: kakaoLogin},
	];
	return (
		<SafeAreaView>
			<Center>
				<Heading marginTop={16} fontWeight={'extrabold'} fontSize={'3xl'}>
					다님
				</Heading>
				<Heading marginTop={4} fontWeight={'medium'} fontSize={'2xl'}>
					여행을 편하게, 쉽게
				</Heading>
				<Text marginTop={4} fontWeight={'hairline'}>
					인기 여행지, 특이 여행지, 콘텐츠까지
				</Text>
				<Text fontWeight={'hairline'}>여행 일정의 모든 것</Text>
				<Image
					marginTop={8}
					source={require('../../../public/images/danim_logo.png')}
					width={24}
					height={24}
					alt='icon'
				/>
				<HStack marginTop={16} space={8}>
					{platforms.map((platform, index) => (
						<Button
							key={index}
							marginTop={4}
							rounded={'full'}
							w={60}
							h={60}
							bgColor={platform.color}
							shadow={2}
							onPress={() => {
								platform.onPress();
							}}>
							<Image source={platform.image} width={12} height={12} resizeMode='contain' />
						</Button>
					))}
					<AppleButton
						buttonStyle={AppleButton.Style.WHITE}
						buttonType={AppleButton.Type.SIGN_IN}
						style={{
							width: 160, // You must specify a width
							height: 45, // You must specify a height
						}}
						onPress={() => appleLogin()}
					/>
				</HStack>
				<Button
					marginTop={24}
					variant={'link'}
					_text={{
						color: '#58AEF3',
						fontSize: '16',
					}}
					onPress={goNext}>
					로그인 없이 다님 이용하기
				</Button>
				<Button
					marginTop={24}
					variant={'link'}
					_text={{
						color: '#58AEF3',
						fontSize: '16',
					}}
					onPress={goAI}>
					AI 테스트하기s
				</Button>
			</Center>
		</SafeAreaView>
	);
}
