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
} from 'native-base';
import {color} from 'native-base/lib/typescript/theme/styled-system';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as KakaoLogin from '@react-native-seoul/kakao-login';

const kakaoLogin = () => {
	KakaoLogin.login()
		.then(result => {
			console.log('Login Success', JSON.stringify(result));
			getProfile();
		})
		.catch(error => {
			if (error.code === 'E_CANCELLED_OPERATION') {
				console.log('Login Cancel', error.message);
			} else {
				console.log(`Login Fail(code:${error.code})`, error.message);
			}
		});
};

const getProfile = () => {
	KakaoLogin.getProfile()
		.then(result => {
			console.log('GetProfile Success', JSON.stringify(result));
		})
		.catch(error => {
			console.log(`GetProfile Fail(code:${error.code})`, error.message);
		});
};

const platforms = [
	{color: 'yellow.300', image: require('../../../public/images/kakao_logo.png'), onPress: kakaoLogin},
	{color: 'white', image: require('../../../public/images/google_logo.png'), onPress: kakaoLogin},
	{color: 'black', image: require('../../../public/images/apple_logo.png'), onPress: kakaoLogin},
];

export default function LoginScreen() {
	const goNext = () => {
		navigation.navigate('Home');
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
			</Center>
		</SafeAreaView>
	);
}
