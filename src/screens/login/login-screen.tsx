import {Google_Signin_Key} from '@env';
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import {Button, Center, HStack, Heading, Image, Text} from 'native-base';
import {Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppDispatch} from '../../redux';
import {socialConnect} from '../../redux/user/login.slice';

export default function LoginScreen({navigation}: any) {
	const goNext = () => {
		//로그인 후 로그아웃은 지금 안됩니다. 왜냐 귀찮기 때문입니다. 아시겠죠?
		//dispatch(logout());
		//dispatch(temporarySignUp());
		//dispatch(loginSliceActions.setAnonymous(true));
		// /navigation.replace('Home');
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
			}
		} catch {
			Alert.alert('카카오 로그인에 실패하였습니다.');
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

	const platforms = [
		{color: 'yellow.300', image: require('../../../public/images/kakao_logo.png'), onPress: kakaoLogin},
		{color: 'white', image: require('../../../public/images/google_logo.png'), onPress: googleLogin},
		{color: 'black', image: require('../../../public/images/apple_logo.png'), onPress: kakaoLogin},
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
