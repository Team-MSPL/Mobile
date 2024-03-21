import {useCallback, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {
	deleteTravelCourse,
	getOneTravelCourse,
	reCourseName,
	travelSliceActions,
} from '../../redux/travel-info/travel.slice';
import {TouchableOpacity} from 'react-native';

import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';

import KakaoShareLink from 'react-native-kakao-share-link';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {
	BackgroundGray,
	Center,
	Divider,
	HStack,
	HeaderContianer,
	HeaderText,
	MainContainer,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
	devicesWidth,
} from '../../utill/layout/layout';
import {DayText} from './my-travel-list';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {SVGMaps, SVGTravlePencil, SvgMilestone, SvgReview} from '../../utill/svg/svg';
import InputDiary from './input-diary';

import Icon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import {getStorage, ref, getDownloadURL, uploadBytes} from 'firebase/storage';
import {storage, firebase} from '../../../config';
import useFirebaseStorage from '../../utill/hooks/useFirebaseStorage';
import useKakaoShare from '../../utill/hooks/useKakaoShare';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {ScrollView} from 'react-native';
export default function DetailInfo({navigation}: any) {
	const {travelId, nDay, day, travelName, picture, reviewCheck} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const Icons = styled(Icon)``;
	const goMyTravelDetail = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			await dispatch(getOneTravelCourse({travelId: travelId}));
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '여행에 대한 기억을 되찾는 중 문제가 발생했습니다.',
					modalSubTitle: '잠시후 다시 시도해주세요',
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
	const {firebaseImageRemove} = useFirebaseStorage();
	const goRemove = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			//await firebaseImageRemove({pictureList: picture, id: travelId, category: 'diary'}); TODO 공유자때문에 공유자가 아무도없을때 백에서 삭제하는로직으로 바꿔야함
			await dispatch(deleteTravelCourse({travelId: travelId}));
			navigation.goBack();
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '여행 삭제가 실패했습니다',
					modalSubTitle: '잠시후 다시 시도해주세요',
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
		if (editing) {
			setEditing(false);
			setText(travelName);
		}
	}; //여행 리뷰 별점 저장하기
	const goTimetable = () => {
		dispatch(travelSliceActions.setMakeMode({shareViewWithStartFlag: false, makeMode: 'modify'}));
		navigation.navigate('Timetable');
		if (editing) {
			setEditing(false);
			setText(travelName);
		}
	};
	const {kakaoShare} = useKakaoShare();
	const goKakaoShare = async () => {
		try {
			if (editing) {
				setEditing(false);
				setText(travelName);
			}
			await kakaoShare({travelName: travelName, travelId: travelId, startDay: day[0], endDay: day[nDay]});
		} catch (err) {
			console.log(err);
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
					<TouchableOpacity
						style={{marginRight: 5}}
						onPress={() => {
							editing
								? dispatch(
										modalSliceActions.setOpenModal({
											modalSubTitle: '변경 사항을 저장하지않고 진행하시겠습니까?',
											modalLeft: true,
											modalFunction: goKakaoShare,
											modalTopText: '나가기',
											modalBottomText: '수정계속하기',
										}),
								  )
								: goKakaoShare();
						}}>
						<PretendardVariableText size={16} lineHeight={24} color={colors.PointYellow}>
							공유
						</PretendardVariableText>
					</TouchableOpacity>
					<TouchableOpacity onPress={removeCheck}>
						<PretendardVariableText size={16} lineHeight={24} color={colors.PointYellow}>
							삭제
						</PretendardVariableText>
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
	const [editing, setEditing] = useState(false);
	const [text, setText] = useState(travelName);
	const checkChange = () => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '제목 변경',
				modalSubTitle: `${text}로 변경하시겠습니까?`,
				modalLeft: true,
				modalFunction: changeTravelName,
			}),
		);
	};
	const changeTravelName = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const data = {updateTravelName: text, travelId: travelId};
			await dispatch(reCourseName(data));
			setEditing(false);
			dispatch(travelSliceActions.enrollTravelName(text));
		} catch {
			dispatch(modalSliceActions.setOpenModal({modalSubTitle: '예기치 못한 오류가 발생했습니다.'}));
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	return (
		<Scroll>
			<PretendardVariableText size={16} lineHeight={24} color={colors.Black}>
				다님과 함께한
			</PretendardVariableText>
			{!editing ? (
				<TravleHStack>
					<PretendardVariableText size={20} lineHeight={27} color={colors.Black}>
						{travelName}
					</PretendardVariableText>
					<ReName
						onPress={() => {
							setEditing(true);
						}}>
						<Icons name={'form'} size={20} color={'grey'} />
					</ReName>
				</TravleHStack>
			) : (
				<RenameContainer>
					<CustomTextInput
						text={text}
						placeholderTextColor={'grey'}
						style={{color: 'black', fontSize: 20}}
						autoFocus={true}
						value={text}
						onChangeText={(value: string) => setText(value)}
						maxLength={20}></CustomTextInput>
					<ReName onPress={checkChange}>
						<Icons name={'save'} size={30} color={'black'} />
					</ReName>
				</RenameContainer>
			)}
			<DayText>{moment(day[0]).format('YYYY년-MM월-DD일') + '~' + moment(day[nDay]).format('MM월-DD일')}</DayText>
			<CourseAndReview>
				<HandleButtonContainer
					backgroundColor={colors.Primary}
					onPress={() => {
						editing
							? dispatch(
									modalSliceActions.setOpenModal({
										modalSubTitle: '변경 사항을 저장하지않고 진행하시겠습니까?',
										modalLeft: true,
										modalFunction: goTimetable,
										modalTopText: '코스확인하기',
										modalBottomText: '수정계속하기',
									}),
							  )
							: goTimetable();
					}}>
					<SVGMaps />
					<PretendardSemiBoldText size={16} lineHeight={19.09} color={colors.Gray5}>
						여행 코스 확인
					</PretendardSemiBoldText>
					{/* <IconContainer>
						<SvgMilestone color='white' />
					</IconContainer> */}
				</HandleButtonContainer>
				<HandleButtonContainer
					backgroundColor='#5350FF'
					onPress={() => {
						editing
							? dispatch(
									modalSliceActions.setOpenModal({
										modalSubTitle: '변경 사항을 저장하지않고 진행하시겠습니까?',
										modalLeft: true,
										modalFunction: goReviewAndRating,
										modalTopText: '리뷰작성하기',
										modalBottomText: '수정계속하기',
									}),
							  )
							: goReviewAndRating();
					}}>
					{/* <VStack>
						<ReviewTitleText>리뷰 작성</ReviewTitleText>
						<ReviewSubTitleText>다른 여행자들에게 도움이 되는 리뷰를 작성해주세요</ReviewSubTitleText>
					</VStack>
					<IconContainer>
						<SvgReview color={colors.selectButton} />
					</IconContainer> */}
					<SVGTravlePencil />
					<PretendardSemiBoldText size={16} lineHeight={19.09} color={colors.backgroundWhite}>
						리뷰 작성
					</PretendardSemiBoldText>
				</HandleButtonContainer>
			</CourseAndReview>
			<InputDiary navigation={navigation} />
		</Scroll>
	);
}
const Scroll = styled(BackgroundGray).attrs({as: ScrollView})``;

const HandleButtonContainer = styled.TouchableOpacity<{backgroundColor: string}>`
	width: ${widthPercentage(151)}px;
	height: ${heightPercentage(105)}px;
	background-color: ${props => props.backgroundColor};
	border-radius: 12px;
	align-items: center;
	justify-content: center;
`;
const InfoDivider = styled(Divider)`
	background-color: ${colors.regionNormal};
`;
const ReName = styled.TouchableOpacity`
	padding: 5px;
`;
const RenameContainer = styled(HStack)`
	border-bottom-width: 1px;
	align-items: center;
	width: 70%;
	margin: 0px 0px 5px 0px;
`;
const TravleHStack = styled(HStack)`
	width: 100%;
	align-items: center;
	margin: 0px 0px 5px 0px;
`;
const TravelNameText = styled.Text`
	width: 90%;
	font-size: ${devicesWidth * 0.08}px;
	color: ${colors.selectButton};
	margin: ${devicesWidth * 0.01}px;
`;

export const IconContainer = styled.View`
	width: 100%;
	align-items: flex-end;
`;
export const CourseAndReview = styled(HStack)`
	width: 100%;
	margin: 10px 0px 10px 0px;
	justify-content: space-between;
`;
export const CourseContainer = styled.TouchableOpacity`
	width: 45%;
	padding: 15px;
	height: 150px;
	border-radius: 10px;
	background: ${colors.Primary};
	justify-content: space-between;
`;
export const CourseTitleText = styled.Text`
	font-size: ${devicesWidth * 0.05}px;
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
const CustomTextInput = styled.TextInput<{text: string}>`
	width: 80%;
	padding: 8px;
	font-size: 16px;
	font-weight: 400;
	border-radius: 8px;
`;
