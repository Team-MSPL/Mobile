import {Image, Text, Center, Box, ScrollView, Button, VStack} from 'native-base';
import {useEffect} from 'react';
import {Touchable, TouchableOpacity, Linking} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {loginSliceActions} from '../../redux/user/login.slice';
import {logout} from '../../redux/user/user.slice';
export default function MoreInfo({navigation}: any) {
	const {isLogin, userName, socialloginProvider, functionToken} = useAppSelector(state => state.userSlice);

	const {anonymous} = useAppSelector(state => state.loginSlice);
	//const {functionToken} = useAppSelector(state => state.loginSlice);
	const dispatch = useAppDispatch();

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					onPress={() => {
						navigation.navigate('MoreInfo');
					}}>
					<Text>고</Text>
				</TouchableOpacity>
			),
		});
	}, []);
	const goLogout = () => {
		console.log(socialloginProvider);
		// dispatch(logout());
		// navigation.popToTop();
	};
	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			{isLogin || anonymous ? (
				<Box>
					<Text>
						{userName ?? '익명'} 님 반갑고 {socialloginProvider ?? '익명'} 로그인임
					</Text>
					{/* {anonymous ? (
						<TouchableOpacity
							onPress={() => {
								dispatch(loginSliceActions.setAnonymous(false)), navigation.popToTop();
							}}>
							<Text>익명 나가기</Text>
						</TouchableOpacity>
					) : (
						<TouchableOpacity onPress={goLogout}>
							<Text>로그아웃</Text>
						</TouchableOpacity>
					)} */}
				</Box>
			) : (
				<TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
					<Text>로그인ㄱ</Text>
				</TouchableOpacity>
			)}
			<Box>
				<TouchableOpacity onPress={() => navigation.popToTop()}>
					<Text>너님 토큰 갯수{functionToken}</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navigation.popToTop()}>
					<Text>이벤트 모아보기</Text>
				</TouchableOpacity>
				<Text>앱버전 0.0</Text>
				<TouchableOpacity onPress={() => navigation.popToTop()}>
					<Text>문의하기</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navigation.popToTop()}>
					<Text>공지사항</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navigation.popToTop()}>
					<Text>서비스 이용약관</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={goLogout}>
					<Text>개인정보 처리방침</Text>
				</TouchableOpacity>
			</Box>
		</ScrollView>
	);
}
