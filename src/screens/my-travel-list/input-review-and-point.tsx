import {JSX, JSXElementConstructor, ReactElement, useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {
	deleteTravelCourse,
	getDrivingDuration,
	getOneTravelCourse,
	reviewAndPoint,
	saveTravel,
	travelSliceActions,
	updateTravelCourse,
} from '../../redux/travel-info/travel.slice';
import shortId from 'shortid';
import {Alert, TouchableOpacity, Image, TextInput} from 'react-native';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';

import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import CustomButton from '../../utill/component/custom-button';
import {tendencyList} from '../enroll-info/select-tendency';
import {modalSliceActions} from '../../redux/modal/modalSlice';
export default function InputReviewAndPoint({navigation}: any) {
	const {travelId, tendency, region, diary, picture, reviewCheck} = useAppSelector(state => state.travelSlice);
	const {userId} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const [reviewValue, setReviewValue] = useState('');
	const [pointValue, setPointValue] = useState(-1);
	const [tedencyPointList, setTedencyPointList] = useState<number[][]>(
		tendency.map(innerArray => innerArray.map(() => 4)),
	);
	let wayPoint = {start: '', goal: '', wayPoint: ''};

	const goMyTravelDetail = async () => {
		await dispatch(getOneTravelCourse({travelId: travelId}));
	};
	const changeReview = (e: string) => {
		setReviewValue(e);
	};
	const changePoint = (e: number) => {
		setPointValue(e);
	};
	const goSaveReviewAndPoint = () => {
		try {
			const data = {travelId: travelId, review: reviewValue, point: pointValue, tendencyPoint: tedencyPointList};
			dispatch(LoadingSliceActions.onLoading());
			dispatch(reviewAndPoint(data));
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '저장 완료 했습니다.',
					modalFunction: () => {
						navigation.goBack();
					},
				}),
			);
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '리뷰 저장 중 에러가 발생했습니다.',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	}; //여행 리뷰 별점 저장하기
	const changeTendencyPoint = (e: {index: number; iindex: number; inex: number}) => {
		let copy = [...tedencyPointList];
		copy[e.index][e.iindex] = e.inex;
		setTedencyPointList(copy);
	};
	useFocusEffect(
		useCallback(() => {
			goMyTravelDetail();
		}, []),
	);
	return (
		<ScrollView bgColor='#EFFBFB'>
			<Text>리뷰 적으삼요</Text>
			<TextInput
				style={{borderWidth: 1}}
				value={reviewValue}
				onChangeText={(value: string) => changeReview(value)}></TextInput>
			<Text>별점은요</Text>
			<HStack>
				{[...Array(5)].map((item, idx) => (
					<TouchableOpacity
						key={idx}
						style={{marginHorizontal: 10, backgroundColor: idx <= pointValue ? 'red' : 'white'}}
						onPress={() => {
							changePoint(idx);
						}}>
						<Text>☆</Text>
					</TouchableOpacity>
				))}
			</HStack>
			{tendency.map(
				(value, index) =>
					value.includes(1) &&
					value.map(
						(vvalue, iindex) =>
							vvalue == 1 && (
								<HStack marginY='4' key={iindex}>
									<Text>{reviewTendencyList[index].list[iindex]}</Text>
									{[...Array(5)].map((_, inex) => (
										<TouchableOpacity
											key={inex}
											style={{
												marginHorizontal: 10,
												backgroundColor:
													inex <= tedencyPointList[index][iindex] ? 'red' : 'white',
											}}
											onPress={() => {
												changeTendencyPoint({index: index, iindex: iindex, inex: inex});
											}}>
											<Text>☆</Text>
										</TouchableOpacity>
									))}
								</HStack>
							),
					),
			)}

			<CustomButton label='리뷰 저장하기' onPress={goSaveReviewAndPoint} />
		</ScrollView>
	);
}

const reviewTendencyList = [
	...tendencyList,
	{title: '계절이 언제인가?', multi: true, list: ['봄', '여름', '가을', '겨울']},
];
