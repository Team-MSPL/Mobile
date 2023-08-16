import moment from 'moment';
import {Image, Text, Center, Box, ScrollView, Button, VStack} from 'native-base';
import {useEffect} from 'react';
import {Touchable, TouchableOpacity, Linking, Alert} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {deleteTravelCourse, getOneTravelCourse} from '../../redux/travel-info/travel.slice';
import {loginSliceActions} from '../../redux/user/login.slice';
import {logout, updateFunctionToken, userSliceActions, userWithdraw} from '../../redux/user/user.slice';
export default function MoreInfo({navigation}: any) {
	const {isLogin, userName, socialloginProvider, functionToken, userId, userToken} = useAppSelector(
		state => state.userSlice,
	);

	const {anonymous} = useAppSelector(state => state.loginSlice);
	const {myTravelList} = useAppSelector(state => state.travelSlice);
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
	const goWithdraw = () => {
		try {
			let signUpFirebase = socialloginProvider == 'kakao' || socialloginProvider == 'apple';
			const data = {userToken: userToken, signUpFirebase: !signUpFirebase};
			console.log(data);
			dispatch(userWithdraw(data));
			navigation.popToTop();
		} catch (err) {
			Alert.alert('회원탈퇴중 에러요');
		}
	};
	const goDetailTimetable = (e: string) => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			dispatch(getOneTravelCourse({travelId: e}));
		} catch (err) {
			Alert.alert('탐테가다가 에러뜸');
		} finally {
			setTimeout(() => {
				dispatch(LoadingSliceActions.offLoading());
				navigation.navigate('Timetable');
			}, 500);
		}
	};

	const goDeleteTimetable = (e: string) => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			dispatch(deleteTravelCourse({travelId: e}));
		} catch (err) {
			Alert.alert('탐테가다가 에러뜸');
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			{isLogin || anonymous ? (
				<Box>
					<Text>
						{userName ?? '익명'} 님 반갑고 {socialloginProvider ?? '익명'} 로그인임
					</Text>
					<TouchableOpacity onPress={goWithdraw}>
						<Text>회원탈퇴{}</Text>
					</TouchableOpacity>
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
				<TouchableOpacity onPress={() => dispatch(updateFunctionToken({functionToken: 4}))}>
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
			{myTravelList.map((item, value) => (
				<Box>
					<TouchableOpacity
						onPress={() => {
							goDetailTimetable(item._id);
						}}>
						<Text>
							{moment(item.day[0]).format('YY-MM-DD') + ' ' + item.nDay + ' 일 여행' + item.region}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							goDeleteTimetable(item._id);
						}}>
						<Text>위에거 삭제요</Text>
					</TouchableOpacity>
				</Box>
			))}
		</ScrollView>
	);
}
