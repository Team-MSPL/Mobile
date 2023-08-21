import {JSX, JSXElementConstructor, ReactElement, useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {
	deleteTravelCourse,
	getDrivingDuration,
	getOneTravelCourse,
	saveTravel,
	travelSliceActions,
	updateTravelCourse,
} from '../../redux/travel-info/travel.slice';
import shortId from 'shortid';
import {Alert, TouchableOpacity, Image} from 'react-native';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';

import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
export default function DetailInfo({navigation}: any) {
	const {travelId, nDay, region, diary, picture, reviewCheck} = useAppSelector(state => state.travelSlice);
	const {userId} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const [select, setSelect] = useState(0);
	const [deleteList, setDeleteList] = useState<string[]>([]);
	const [addList, setAddList] = useState<number[]>([]);
	const [x, setX] = useState(-1);
	const [viewDayIndex, setViewDayIndex] = useState(0);
	let wayPoint = {start: '', goal: '', wayPoint: ''};

	const goMapInfo = () => {
		navigation.navigate('MapInfo');
	};
	const goInputDiary = () => {
		navigation.navigate('InputDiary');
	};
	const goMyTravelDetail = async () => {
		await dispatch(getOneTravelCourse({travelId: travelId}));
	};
	const goRemove = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			await dispatch(deleteTravelCourse({travelId: travelId}));
			navigation.goBack();
		} catch (err) {
			Alert.alert('삭제중 에러가 발생했습니다.');
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const goReviewAndRating = () => {
		console.log(picture);
		navigation.navigate('InputReviewAndPoint');
	}; //여행 리뷰 별점 저장하기
	const goTimetable = () => {
		navigation.navigate('Timetable');
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
			{picture.length != 0 ? (
				<Image source={{uri: picture && picture[0]}} style={{width: 100, height: 100}}></Image>
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

			<TouchableOpacity onPress={goRemove}>
				<Text bold fontSize='lg'>
					삭제할래?
				</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}
