import {useCallback, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getOneTravelCourse, reviewAndPoint} from '../../redux/travel-info/travel.slice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {useFocusEffect} from '@react-navigation/native';
import CustomButton from '../../utill/component/custom-button';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {MainContainer, MainText, HStack, BackgroundGray, PretendardVariableText} from '../../utill/layout/layout';
import {SvgStart} from '../../utill/svg/svg';
import {colors} from '../../utill/colors';
import styled from 'styled-components/native';
import {DiaryTextInput} from './input-diary';
import {useTendencyHandler} from '../../utill/hooks/useTendencyHandler';
import {Keyboard, ScrollView} from 'react-native';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
export default function InputReviewAndPoint({navigation}: any) {
	const {travelId, tendency} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [reviewValue, setReviewValue] = useState('');
	const [pointValue, setPointValue] = useState(5);
	const [detailView, setDetailView] = useState(false);
	const [tedencyPointList, setTedencyPointList] = useState<number[][]>(
		tendency.map(innerArray => innerArray.map(() => 4)),
	);

	const {tendencyList} = useTendencyHandler();

	const reviewTendencyList = [
		...tendencyList,
		{title: '계절이 언제인가?', multi: true, list: ['봄', '여름', '가을', '겨울']},
	];
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
					modalBottomFunction: () => {
						navigation.goBack();
					},
					modalBottomFunctionUse: true,
					modalTopText: '확인',
					modalBottomText: '나가기',
				}),
			);
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '리뷰 저장이 실패했습니다',
					modalSubTitle: '잠시후 다시 시도해주세요',
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
	const changeDetailView = () => {
		setDetailView(!detailView);
	};
	useFocusEffect(
		useCallback(() => {
			goMyTravelDetail();
		}, []),
	);
	return (
		<Scroll>
			<PretendardVariableText size={20} lineHeight={27} color={colors.Black}>
				어떤 점이 좋았나요?
			</PretendardVariableText>
			{/* <ElementText>이 여행 코스는 어떠셨나요?</ElementText> */}
			<ReviewContainer>
				{[...Array(5)].map((item, idx) => (
					<RatingElement
						key={idx}
						onPress={() => {
							changePoint(idx);
						}}>
						<SvgStart
							width={20}
							height={20}
							color={idx <= pointValue ? colors.Primary : colors.emptyStart}
						/>
					</RatingElement>
				))}
			</ReviewContainer>
			{/* <ElementText>어떤 점이 좋았나요?</ElementText> */}
			<RatingReview
				placeholder='좋았던 점을 남겨주세요'
				placeholderTextColor={'grey'}
				style={{color: 'black'}}
				value={reviewValue}
				onChangeText={(value: string) => changeReview(value)}></RatingReview>
			{/* <DetailRating onPress={changeDetailView}>
				<ElementText>상세 리뷰 {!detailView ? '열기' : '닫기'}</ElementText>
			</DetailRating> */}
			{tendency.map((value, index) =>
				value.map(
					(vvalue, iindex) =>
						vvalue == 1 && (
							<HStack key={iindex}>
								<PretendardVariableText size={14} lineHeight={21} color={colors.Black}>
									{reviewTendencyList[index].list[iindex]}
								</PretendardVariableText>
								{[...Array(5)].map((_, inex) => (
									<RatingElement
										key={inex}
										onPress={() => {
											changeTendencyPoint({index: index, iindex: iindex, inex: inex});
										}}>
										<SvgStart
											width={20}
											height={20}
											color={
												inex <= tedencyPointList[index][iindex]
													? colors.Primary
													: colors.emptyStart
											}
										/>
									</RatingElement>
								))}
							</HStack>
						),
				),
			)}
			<TestButton onPress={goSaveReviewAndPoint}>
				<PretendardVariableText size={14} lineHeight={21} color={colors.Black}>
					저장하기
				</PretendardVariableText>
			</TestButton>
			{/* <CustomButton label='리뷰 저장하기' onPress={goSaveReviewAndPoint} /> */}
		</Scroll>
	);
}

const TestButton = styled.TouchableOpacity`
	width: ${widthPercentage(120)}px;
	height: ${heightPercentage(40)}px;
	border-radius: 12px;
	background-color: ${colors.Primary};
	align-items: center;
	justify-content: center;
	align-self: center;
	margin-top: ${widthPercentage(10)}px;
`;
const Scroll = styled(BackgroundGray).attrs({as: ScrollView})``;
const DetailRating = styled.TouchableOpacity`
	width: 100%;
	justify-content: center;
	flex-direction: row;
`;

const ReviewAndPointContainer = styled(MainContainer)`
	flex: 1;
`;
const RatingReview = styled(DiaryTextInput)`
	height: ${heightPercentage(225)}px;
`;
const RatingElement = styled.TouchableOpacity`
	margin: 0px 10px 0px 10px;
`;
const ElementText = styled.Text`
	font-size: 20px;
	font-weight: 500;
	color: black;
	margin: 10px 0px;
`;
const ReviewContainer = styled(HStack)`
	justify-content: center;
`;
