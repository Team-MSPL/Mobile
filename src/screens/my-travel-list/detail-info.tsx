import {useCallback, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {deleteTravelCourse, getOneTravelCourse, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {TouchableOpacity, Platform} from 'react-native';

import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';

import KakaoShareLink from 'react-native-kakao-share-link';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {HStack, HeaderContianer, HeaderText, MainContainer, VStack} from '../../utill/layout/layout';
import {DayText} from './my-travel-list';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {SvgMilestone, SvgReview, SvgShare} from '../../utill/svg/svg';
import InputDiary from './input-diary';
export default function DetailInfo({navigation}: any) {
	const {travelId, nDay, day, travelName, picture, reviewCheck} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
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
	const removeCheck = () => {
		dispatch(
			modalSliceActions.setOpenModal({modalTitle: '삭제하시겠습니까?', modalFunction: goRemove, modalLeft: true}),
		);
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
		reviewCheck
			? dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '이미 리뷰작성을 하셨습니다.',
					}),
			  )
			: navigation.navigate('InputReviewAndPoint');
	}; //여행 리뷰 별점 저장하기
	const goTimetable = () => {
		dispatch(travelSliceActions.setMakeMode('modify'));
		navigation.navigate('Timetable');
	};

	const goKakaoShare = async () => {
		try {
			const response = await KakaoShareLink.sendFeed({
				content: {
					title: travelName,
					imageUrl: 'https://danim.me/square_logo.png',
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
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '카카오 공유 중 문제가 발생했습니다.',
				}),
			);
		}
	};
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<HeaderContianer>
					<TouchableOpacity onPress={goKakaoShare}>
						<HeaderText>공유</HeaderText>
					</TouchableOpacity>
					<TouchableOpacity onPress={removeCheck}>
						<HeaderText>삭제</HeaderText>
					</TouchableOpacity>
				</HeaderContianer>
			),
		});
	}, []);
	useFocusEffect(
		useCallback(() => {
			goMyTravelDetail();
		}, []),
	);
	return (
		<MainContainer>
			<DayText>{moment(day[0]).format('YYYY년-MM월-DD일') + '~' + moment(day[nDay]).format('MM월-DD일')}</DayText>
			<InputDiary navigation={navigation} />
			<CourseAndReview>
				<CourseContainer onPress={goTimetable}>
					<VStack>
						<CourseTitleText>여행 코스 확인</CourseTitleText>
						<CourseSubTitleText>지난 여행 코스를 확인해보세요</CourseSubTitleText>
					</VStack>
					<IconContainer>
						<SvgMilestone color='white' />
					</IconContainer>
				</CourseContainer>
				<ReviewContainer onPress={goReviewAndRating}>
					<VStack>
						<ReviewTitleText>리뷰 작성</ReviewTitleText>
						<ReviewSubTitleText>다른 여행자들에게 도움이 되는 리뷰를 작성해주세요</ReviewSubTitleText>
					</VStack>
					<IconContainer>
						<SvgReview color={colors.selectButton} />
					</IconContainer>
				</ReviewContainer>
			</CourseAndReview>
		</MainContainer>
	);
}

export const IconContainer = styled.View`
	width: 100%;
	align-items: flex-end;
`;
export const CourseAndReview = styled(HStack)`
	width: 100%;
	margin: 0px 0px 10px 0px;
	justify-content: space-between;
`;
export const CourseContainer = styled.TouchableOpacity`
	width: 45%;
	padding: 15px;
	height: 150px;
	border-radius: 10px;
	background: ${colors.selectButton};
	justify-content: space-between;
`;
export const CourseTitleText = styled.Text`
	font-size: 20px;
	font-weight: bold;
	color: white;
	margin: 0px 0px 5px 0px;
`;
export const CourseSubTitleText = styled.Text`
	font-size: 15px;
	color: white;
`;

const ReviewContainer = styled(CourseContainer)`
	background: ${colors.reviewBackground};
`;
const ReviewTitleText = styled(CourseTitleText)`
	color: ${colors.selectButton};
`;
const ReviewSubTitleText = styled(CourseSubTitleText)`
	color: ${colors.selectButton};
`;
export const HeaderHStack = styled(HStack)`
	justify-content: space-between;
`;
