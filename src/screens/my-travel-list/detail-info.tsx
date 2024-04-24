import {JSXElementConstructor, ReactElement, useCallback, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {
	deleteTravelCourse,
	getOneTravelCourse,
	getRegionInfo,
	reCourseName,
	travelSliceActions,
} from '../../redux/travel-info/travel.slice';
import {Modal, Platform, Touchable, TouchableOpacity} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';

import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';

import KakaoShareLink from 'react-native-kakao-share-link';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {
	BackgroundGray,
	HStack,
	HeaderContianer,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
	devicesWidth,
} from '../../utill/layout/layout';
import {DayText} from './my-travel-list';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {SVGMaps, SVGPencil, SVGTravlePencil, SvgShare} from '../../utill/svg/svg';
import InputDiary from './input-diary';

import Icon from 'react-native-vector-icons/AntDesign';
import useFirebaseStorage from '../../utill/hooks/useFirebaseStorage';
import useKakaoShare from '../../utill/hooks/useKakaoShare';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {ScrollView} from 'react-native';
import {AbsoluteTopBar} from '../timetable/map-info';
import {RegionImage} from '../enroll-info/final-check';
import {MarkerContainer} from '../timetable/preset-detail';
import {Circle} from '../timetable/preset';
import PrimaryButton from '../../utill/component/primary-button';
import ViewPager from '../../utill/view-pager';
import {useViewPager} from '../../utill/hooks/useViewPager';
export default function DetailInfo({navigation}: any) {
	const {travelId, nDay, day, travelName, reviewCheck, region, regionInfo, timetable} = useAppSelector(
		state => state.travelSlice,
	);
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
	const markers: ReactElement<any, string | JSXElementConstructor<any>> | JSX.Element[][] | null | undefined = [];
	const polylines:
		| string
		| number
		| boolean
		| JSX.Element[]
		| ReactElement<any, string | JSXElementConstructor<any>>
		| null
		| undefined = [];
	let positions: {latitude: number; longitude: number}[] = [];
	timetable.forEach((value, index) => {
		const polylineCoordinates = value
			.map((item, value) => {
				if (item.name != '점심 추천' && item.name != '저녁 추천' && item.name != '숙소 추천') {
					return {latitude: item.lat, longitude: item.lng};
				}
				return null;
			})
			.filter(items => items !== null);
		value.map(vvalue =>
			positions.push({
				latitude: vvalue.lat,
				longitude: vvalue.lng,
			}),
		);
		let count = 0;
		markers.push(
			value.map((item, idx) => {
				if (item.name != '점심 추천' && item.name != '저녁 추천' && item.name != '숙소 추천') {
					count += 1;
					return (
						<Marker
							key={`marker_${idx}`}
							coordinate={{latitude: item.lat, longitude: item.lng}}
							title={item.name}
							centerOffset={Platform.OS == 'android' ? {x: 0, y: 0} : {x: 0, y: -20}}
							anchor={{x: 0.5, y: 0.5}}
							style={{zIndex: 4}}>
							{index == 0 ? (
								<MarkerContainer key={idx}>
									<PretendardSemiBoldText size={13} lineHeight={19} color={colors.backgroundWhite}>
										{count}
									</PretendardSemiBoldText>
								</MarkerContainer>
							) : (
								<Circle color={colors.Gray5} key={idx} />
							)}
						</Marker>
					);
				} else {
					return null;
				}
			}),
		);
		polylines.push(
			<Polyline
				key={`polyline_${index}`}
				coordinates={polylineCoordinates}
				strokeColor={index == 0 ? colors.PointYellow : colors.Gray5}
				strokeWidth={2} // You can change the width of the line here
			/>,
		);
	});

	const minLatitude = Math.min(...positions.map(marker => marker.latitude));
	const maxLatitude = Math.max(...positions.map(marker => marker.latitude));
	const minLongitude = Math.min(...positions.map(marker => marker.longitude));
	const maxLongitude = Math.max(...positions.map(marker => marker.longitude));

	// 경계 상자의 중심 좌표 계산
	const centerLatitude = (maxLatitude + minLatitude) / 2;
	const centerLongitude = (maxLongitude + minLongitude) / 2;

	// 경계 상자의 너비와 높이 계산
	const deltaLatitude = maxLatitude - minLatitude;
	const deltaLongitude = maxLongitude - minLongitude;

	// 너비와 높이 중 큰 값을 기준으로 줌 레벨 계산
	const maxDelta = Math.max(deltaLatitude, deltaLongitude);
	const removeCheck = () => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '이 여행을 삭제할까요?',
				modalSubTitle: '여행을 삭제하면 되돌릴 수 없습니다.',
				modalFunction: goRemove,
				modalTopText: '삭제할래요',
				modalLeft: true,
			}),
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
	const goTimetable = async () => {
		dispatch(travelSliceActions.setMakeMode({shareViewWithStartFlag: false, makeMode: 'modify'}));
		dispatch(getRegionInfo({region: region[0]}));
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
	const [modify, setModify] = useState(false);
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<HeaderContianer>
					{!modify ? (
						<>
							<TouchableOpacity onPress={removeCheck} style={{marginRight: 15}}>
								<PretendardVariableText size={16} lineHeight={24} color={colors.PointGreen1}>
									삭제
								</PretendardVariableText>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									setModify(true);
								}}>
								<PretendardVariableText size={16} lineHeight={24} color={colors.PointYellow}>
									편집
								</PretendardVariableText>
							</TouchableOpacity>
						</>
					) : (
						<TouchableOpacity
							onPress={() => {
								setModify(false);
							}}>
							<PretendardVariableText size={16} lineHeight={24} color={colors.PointYellow}>
								완료
							</PretendardVariableText>
						</TouchableOpacity>
					)}
				</HeaderContianer>
			),
		});
	}, [modify]);
	useEffect(() => {
		getMainViewPager();
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
	const {getMainViewPager, deleteMainViewPager, viewPagerState} = useViewPager({title: 'afterTravelViewPager'});

	return (
		<Scroll>
			<AbsoluteTopBar opacityState={false}>
				<HStack gap={10} marginVertical={heightPercentage(10)} width={widthPercentage(375)}>
					<RegionImage
						source={{
							uri: regionInfo?.photo == '' ? 'https://danim.me/square_logo.png' : regionInfo?.photo,
						}}
					/>
					<HStack justifyContent='space-between' width={widthPercentage(290)}>
						<VStack>
							<HStack>
								<PretendardVariableText size={12} lineHeight={18} color={colors.PointYellow}>
									{region[0]}
									{region.length >= 2 ? ` +${region.length - 1}` : ''}
								</PretendardVariableText>
								<PretendardVariableText size={12} lineHeight={18} color={colors.Gray2}>
									{' '}
									| {moment(day[0]).format('YY.MM.DD') + ' - ' + moment(day[nDay]).format('YY.MM.DD')}
								</PretendardVariableText>
							</HStack>
							<HStack gap={4}>
								{!editing ? (
									<PretendardSemiBoldText size={16} lineHeight={21.6} color={colors.Gray5}>
										{travelName}
									</PretendardSemiBoldText>
								) : (
									<CustomTextInput
										text={text}
										placeholderTextColor={'grey'}
										style={{color: 'black', fontSize: heightPercentage(18)}}
										autoFocus={true}
										value={text}
										onChangeText={(value: string) => setText(value)}
										maxLength={20}></CustomTextInput>
								)}
								{modify && !editing && (
									<TouchableOpacity
										onPress={() => {
											setEditing(true);
										}}>
										<SVGPencil color={colors.PointYellow} />
									</TouchableOpacity>
								)}
							</HStack>
						</VStack>
						{!modify && (
							<TouchableOpacity onPress={goKakaoShare}>
								<SvgShare />
							</TouchableOpacity>
						)}
					</HStack>
				</HStack>
			</AbsoluteTopBar>
			<MapContainer>
				<MapView
					//provider={PROVIDER_GOOGLE}
					showsMyLocationButton={true}
					style={{width: '100%', height: 350}}
					showsUserLocation={true}
					region={{
						latitude: centerLatitude,
						longitude: centerLongitude,
						latitudeDelta: deltaLatitude + deltaLatitude,
						longitudeDelta: deltaLongitude + deltaLongitude,
					}}>
					{markers}
					{polylines}
				</MapView>
				{!modify && (
					<AbsoluteButton>
						<PrimaryButton
							label='여행 코스 확인하기'
							onPress={goTimetable}
							backgroundColor={colors.PointYellow}
							textColor={colors.backgroundWhite}
							width={widthPercentage(150)}
							height={heightPercentage(50)}></PrimaryButton>
					</AbsoluteButton>
				)}
			</MapContainer>
			{/* <CourseAndReview>
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
					<SVGTravlePencil />
					<PretendardSemiBoldText size={16} lineHeight={19.09} color={colors.backgroundWhite}>
						리뷰 작성
					</PretendardSemiBoldText>
				</HandleButtonContainer>
			</CourseAndReview> */}
			<InputDiary
				navigation={navigation}
				modify={modify}
				setModify={setModify}
				text={text}
				setEditing={setEditing}
			/>
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={viewPagerState}
				onRequestClose={deleteMainViewPager}>
				<ViewPager sliceNumber={4} handleFunction={deleteMainViewPager} />
			</Modal>
		</Scroll>
	);
}
const AbsoluteButton = styled.View`
	position: absolute;
	z-index: 5;
	bottom: ${heightPercentage(50)}px;
`;
const MapContainer = styled.View`
	width: 100%;
	height: ${heightPercentage(350)}px;
	align-items: center;
`;
const Scroll = styled.ScrollView``;

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
