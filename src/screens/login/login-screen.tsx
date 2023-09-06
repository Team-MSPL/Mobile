import {Google_Signin_Key} from '@env';
import {AppleButton, appleAuth} from '@invertase/react-native-apple-authentication';
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import jwtDecode from 'jwt-decode';
import {Button, Center, HStack, Heading, Image, Text} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppDispatch} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {socialConnect} from '../../redux/user/login.slice';

export default function LoginScreen({navigation}: any) {
	const goNext = () => {
		//로그인 후 로그아웃은 지금 안됩니다. 왜냐 귀찮기 때문입니다. 아시겠죠?
		//dispatch(logout());
		//dispatch(temporarySignUp());
		//dispatch(loginSliceActions.setAnonymous(true));
		// /navigation.replace('Home');
	};

	interface appleTokenType {
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
			console.log('구그르르르');
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
			console.log('asdㅁㅁㄴㄹ');
			// 1). 로그인 요청 수행
			const appleAuthRequestResponse = await appleAuth.performRequest({
				requestedOperation: appleAuth.Operation.LOGIN,
				requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
			});

			// get current authentication state for user
			const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

			// use credentialState response to ensure the user is authenticated
			if (credentialState === appleAuth.State.AUTHORIZED) {
				// user is authenticated
				const {identityToken, email, user} = appleAuthRequestResponse;
				const decodedToken: appleTokenType = jwtDecode(identityToken!);
				// TODO 애플 로그인 성공 후 slice에 저장하는 것 해야함.
				console.log('email_from_decodedToken', decodedToken.email);
				console.log('email', email);
				console.log('user', user);
			}
		} catch (error: any) {
			if (error.code === appleAuth.Error.CANCELED) {
				// login canceled
			} else {
				// login error
			}
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
