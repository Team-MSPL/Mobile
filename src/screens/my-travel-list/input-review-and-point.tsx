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
import {Alert, TouchableOpacity, Image, TextInput, View, Pressable, Keyboard} from 'react-native';

import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import CustomButton from '../../utill/component/custom-button';
import {tendencyList} from '../enroll-info/select-tendency';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {MainContainer, MainText, HStack} from '../../utill/layout/layout';
import {SvgStart} from '../../utill/svg/svg';
import {colors} from '../../utill/colors';
import styled from 'styled-components/native';
import {DiaryTextInput} from './input-diary';
export default function InputReviewAndPoint({navigation}: any) {
	const {travelId, tendency, region, diary, picture, reviewCheck} = useAppSelector(state => state.travelSlice);
	const {userId} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const [reviewValue, setReviewValue] = useState('');
	const [pointValue, setPointValue] = useState(5);
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
		<ReviewAndPointContainer
			onPress={() => {
				Keyboard.dismiss();
			}}>
			<MainText>이 여행 코스는 어떠셨나요?</MainText>
			<HStack>
				{[...Array(5)].map((item, idx) => (
					<RatingElement
						key={idx}
						onPress={() => {
							changePoint(idx);
						}}>
						<SvgStart color={idx <= pointValue ? colors.selectButton : colors.emptyStart} />
					</RatingElement>
				))}
			</HStack>
			<MainText>어떤 점이 좋았나요?</MainText>
			<RatingReview
				placeholder='좋았던 점을 남겨주세요'
				placeholderTextColor={'grey'}
				value={reviewValue}
				onChangeText={(value: string) => changeReview(value)}></RatingReview>

			{tendency.map(
				(value, index) =>
					value.includes(1) &&
					value.map(
						(vvalue, iindex) =>
							vvalue == 1 && (
								<HStack key={iindex}>
									<MainText>{reviewTendencyList[index].list[iindex]}</MainText>
									{[...Array(5)].map((_, inex) => (
										<RatingElement
											key={inex}
											onPress={() => {
												changeTendencyPoint({index: index, iindex: iindex, inex: inex});
											}}>
											<SvgStart
												color={
													inex <= tedencyPointList[index][iindex]
														? colors.selectButton
														: colors.emptyStart
												}
											/>
										</RatingElement>
									))}
								</HStack>
							),
					),
			)}

			<CustomButton label='리뷰 저장하기' onPress={goSaveReviewAndPoint} />
		</ReviewAndPointContainer>
	);
}

const reviewTendencyList = [
	...tendencyList,
	{title: '계절이 언제인가?', multi: true, list: ['봄', '여름', '가을', '겨울']},
];

const ReviewAndPointContainer = styled(MainContainer).attrs({as: Pressable})`
	flex: 1;
	align-items: center;
`;
const RatingReview = styled(DiaryTextInput)`
	height: 340px;
`;
const RatingElement = styled.TouchableOpacity`
	margin: 0px 10px 0px 10px;
`;
