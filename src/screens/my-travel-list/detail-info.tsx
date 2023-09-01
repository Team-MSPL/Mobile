import {useCallback, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {deleteTravelCourse, getOneTravelCourse, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {Alert, TouchableOpacity, Image} from 'react-native';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';

import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';

import KakaoShareLink from 'react-native-kakao-share-link';
import {modalSliceActions} from '../../redux/modal/modalSlice';
export default function DetailInfo({navigation}: any) {
	const {travelId, nDay, day, region, diary, picture, reviewCheck} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const goInputDiary = () => {
		navigation.navigate('InputDiary');
	};
	const goMyTravelDetail = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			await dispatch(getOneTravelCourse({travelId: travelId}));
			console.log('아니아니이요', Object.keys(picture));
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '여행 정보를 가져오던 중 에러가 발생했습니다.',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const goRemove = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			await dispatch(deleteTravelCourse({travelId: travelId}));
			navigation.goBack();
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '여행 삭제 중 에러가 발생했습니다.',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const goReviewAndRating = () => {
		console.log(picture);
		navigation.navigate('InputReviewAndPoint');
	}; //여행 리뷰 별점 저장하기
	const goTimetable = () => {
		dispatch(travelSliceActions.setMakeMode('modify'));
		navigation.navigate('Timetable');
	};

	const goKakaoShare = async () => {
		try {
			const response = await KakaoShareLink.sendFeed({
				content: {
					title: region[0],
					imageUrl: 'http://danim.me/moon.jpeg',
					link: {
						webUrl: 'http://danim.me',
						mobileWebUrl: 'http://danim.me',
					},
					description: moment(day[0]).format('YY-MM-DD') + '~' + moment(day[nDay]).format('YY-MM-DD'),
				},
				buttons: [
					{
						title: '앱에서 보기',
						link: {
							androidExecutionParams: [
								{key: 'kakaolink', value: 'Timetable'},
								{key: 'whatId', value: travelId},
							],
							iosExecutionParams: [
								{key: 'kakaolink', value: 'Timetable'},
								{key: 'whatId', value: travelId},
							],
						},
					},
				],
			});
			console.log(response);
		} catch (err) {
			console.log(err);
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '카카오 공유 중 에러가 발생했습니다.',
				}),
			);
		}
	};
	useFocusEffect(
		useCallback(() => {
			goMyTravelDetail();
		}, []),
	);
	return (
		<ScrollView bgColor='#EFFBFB'>
			<Text bold fontSize='lg'>
				일기
			</Text>
			{diary == '' ? (
				<TouchableOpacity onPress={goInputDiary}>
					<Text>일기적으러 고 </Text>
				</TouchableOpacity>
			) : (
				<TouchableOpacity onPress={goInputDiary}>
					<Text>{diary}</Text>
					<Text>인데 수정 고?</Text>
				</TouchableOpacity>
			)}
			{picture && picture.length != 0 ? (
				picture.map((item, idx) => (
					<Image key={idx} source={{uri: item}} style={{width: 100, height: 100}}></Image>
				))
			) : (
				<Text>사진 없어용</Text>
			)}

			<Text bold fontSize='lg'>
				리뷰랑 별점
			</Text>
			{reviewCheck ? (
				<Text>남긴거 확인 했구연 감사루</Text>
			) : (
				<TouchableOpacity onPress={goReviewAndRating}>
					<Text>남기기 고고 </Text>
				</TouchableOpacity>
			)}
			<TouchableOpacity style={{marginVertical: 10}} onPress={goTimetable}>
				<Text bold fontSize='lg'>
					탐테구경 레츠고!
				</Text>
			</TouchableOpacity>

			<TouchableOpacity style={{marginVertical: 10}} onPress={goKakaoShare}>
				<Text bold fontSize='lg'>
					카카오톡 공유 레츠고!
				</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={goRemove}>
				<Text bold fontSize='lg'>
					삭제할래?
				</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}
