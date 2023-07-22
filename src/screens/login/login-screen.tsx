import {useNavigation} from '@react-navigation/native';
import {
	Heading,
	Text,
	Center,
	Box,
	AspectRatio,
	Image,
	HStack,
	Stack,
	Container,
	VStack,
	Button,
	Icon,
	Spacer,
} from 'native-base';
import {color} from 'native-base/lib/typescript/theme/styled-system';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin';

const kakaoLogin = () => {
	KakaoLogin.login()
		.then(result => {
			console.log('Login Success', JSON.stringify(result));
		})
		.catch(error => {
			if (error.code === 'E_CANCELLED_OPERATION') {
				console.log('Login Cancel', error.message);
			} else {
				console.log(`Login Fail(code:${error.code})`, error.message);
			}
		});
};

const googleLogin = async () => {
	GoogleSignin.configure({
		webClientId: '70367155908-li7to5i4bq75mpog69prtpmo7t7hnq5e.apps.googleusercontent.com',
	});
	try {
		await GoogleSignin.hasPlayServices();
		const userInfo = await GoogleSignin.signIn();
		console.log('구글 로그인 이이이이이', userInfo);
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

export default function LoginScreen() {
	const goNext = () => {
		navigation.navigate('Home');
	};
	const goAI = () => {
		navigation.navigate('LocalSearchAITest');
	};
	const navigation = useNavigation();
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
				<Image marginTop={8} source={require('../../../public/images/danim_logo.png')} width={24} height={24} />
				<HStack marginTop={16} space={8}>
					{platforms.map(platform => (
						<Button
							marginTop={4}
							rounded={'full'}
							w={60}
							h={60}
							bgColor={platform.color}
							shadow={2}
							onPress={() => {
								platform.onPress();
								goNext();
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
				
				<Spacer />
				
				<Button
					marginTop={24}
					variant={'link'}
					_text={{
						color: '#58AEF3',
						fontSize: '16',
					}}
					onPress={goAI}>
					AI 테스트하기
				</Button>
			</Center>
		</SafeAreaView>
	);
}
