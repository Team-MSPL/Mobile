import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {Image, Text, Center, Box, ScrollView, Button, VStack} from 'native-base';
import {useEffect} from 'react';
import {Touchable, TouchableOpacity, Linking, Alert} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {
	deleteComment,
	getOnePost,
	reportComment,
	reviewAndPoint,
	saveComment,
	savePost,
	updateDiary,
} from '../../redux/community/community.slice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {deleteTravelCourse, getOneTravelCourse, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {loginSliceActions} from '../../redux/user/login.slice';
import {logout, updateFunctionToken, updateProfile, userSliceActions, userWithdraw} from '../../redux/user/user.slice';
export default function MoreInfo({navigation}: any) {
	const {isLogin, userName, socialloginProvider, functionToken, userId} = useAppSelector(state => state.userSlice);

	const {anonymous} = useAppSelector(state => state.loginSlice);
	const {myTravelList} = useAppSelector(state => state.travelSlice);
	const {postList} = useAppSelector(state => state.communitySlice);
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
	const goLogout = async () => {
		await AsyncStorage.getAllKeys().then(removeList => AsyncStorage.multiRemove(removeList)); //TODO 로그아웃시 지금은 다 날려버림
		dispatch(userSliceActions.reset());
		navigation.replace('LoginScreen');
		Alert.alert('로그아웃 성공이요');
		// navigation.popToTop();
	};
	const goWithdraw = () => {
		try {
			let signUpFirebase = socialloginProvider == 'kakao' || socialloginProvider == 'apple';
			const data = {userId: userId, signUpFirebase: !signUpFirebase};
			console.log(data);
			dispatch(userWithdraw(data));
			navigation.popToTop();
			Alert.alert('탈퇴 성공이요');
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
	const changeInfo = () => {
		dispatch(
			updateProfile({
				userName: '김갑덕',
				userProfileImage:
					'https://naverpa-phinf.pstatic.net/MjAyMzA2MTZfNzcg/MDAxNjg2ODg4Mjc2NDc0.2CquoDFbCvRN7iCfcGLDJx9Fp0OWuEr9vx76P6a_WbMg.9hps3Svcry4CEVWonr_Gzbm1Bb1-8REdzzi2rqFxbtAg.JPEG/230616_2_16868882764632690109850055566388.jpg',
			}),
		);
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
					{anonymous ? (
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
					)}
				</Box>
			) : (
				<TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
					<Text>로그인ㄱ</Text>
				</TouchableOpacity>
			)}
			<Box>
				{/* <TouchableOpacity onPress={() => dispatch(updateFunctionToken({functionToken: 4}))}>
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
				<TouchableOpacity onPress={() => {}}>
					<Text>개인정보 처리방침</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={changeInfo}>
					<Text>정보 변경이요</Text>
				</TouchableOpacity> */}
			</Box>
			{myTravelList.map((item, value) => (
				<Box>
					<TouchableOpacity
						onPress={() => {
							dispatch(travelSliceActions.setMakeMode(false));
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
					<TouchableOpacity
						onPress={() => {
							dispatch(updateDiary({travelId: item._id, diary: '과연첫트?', picture: ['']}));
						}}>
						<Text>다이어리 추가요</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							dispatch(
								reviewAndPoint({
									travelId: item._id,
									review: '리뷰인데용?',
									point: 3,
									tendencyPoint: [],
								}),
							);
						}}>
						<Text>리뷰 별점관리하기</Text>
					</TouchableOpacity>
				</Box>
			))}
			{/* <TouchableOpacity
						onPress={() => {
							dispatch(
								getPostList({
								}),
							);
						}}>
						<Text>게시글 가져오기</Text>
					</TouchableOpacity> */}
			{postList.map((value, idx) => (
				<Box>
					<TouchableOpacity
						onPress={() => {
							dispatch(getOnePost({postId: value.postId}));
						}}>
						<Text>{value.postTitle}</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							dispatch(
								deleteComment({
									postId: value.postId,
									commentId: '64ddefe745c7d0b48873b166',
								}),
							);
						}}>
						<Text>위에꺼 수정하기</Text>
					</TouchableOpacity>
				</Box>
			))}
			<TouchableOpacity
				onPress={() => {
					dispatch(
						savePost({
							postTitle: '타이타이타이완',
							postContent: '내용이구연',
							postImage: [],
							postedAt: '20230817',
						}),
					);
				}}>
				<Text>글 적어볼까용?</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}
