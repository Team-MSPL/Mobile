import {useCallback, useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView} from 'react-native';
import {
	getPlaceInfo,
	courseInfoType,
	travelSliceActions,
	deletePlaceReview,
} from '../../redux/travel-info/travel.slice';
import {GOOGLE_API_KEY} from '@env';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import ImageView from 'react-native-image-viewing';
import styled from 'styled-components/native';
import {
	Center,
	Divider,
	HStack,
	MainText,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
	devicesWidth,
} from '../../utill/layout/layout';
import {colors} from '../../utill/colors';
import {SVGReviewPencil, SvgCalendar, SvgCall, SvgInfos, SvgLocation, SvgRight, SvgStart} from '../../utill/svg/svg';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import {ButtonHStack, GoRecommendButton, RecommendBorderContainer} from '../enroll-info/region-recommend/detail-result';
import {cityViewList} from '../enroll-info/select-city';
import shortId from 'shortid';
import Icon from 'react-native-vector-icons/AntDesign';
import {useFocusEffect} from '@react-navigation/native';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {WhiteContainer} from '../enroll-info/final-check';
import useFirebaseStorage from '../../utill/hooks/useFirebaseStorage';
import CustomButton from '../../utill/component/custom-button';
import {hikingRecommendSliceActions} from '../../redux/travel-info/hiking.slice';
import {ButtonContainer} from '../enroll-info/select-multi';
import PrimaryButton from '../../utill/component/primary-button';
import {ActiveDot, Dot, PostImageSwiper} from '../../utill/component/community/community-post';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
export default function CourseDetail({navigation, route}: any) {
	const Icons = styled(Icon)``;
	const [courseDetail, setCourseDetail] = useState<courseInfoType>();
	const dispatch = useAppDispatch();
	const [visible, setVisible] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const {region, selectStartDate} = useAppSelector(state => state.travelSlice);
	const {userIdToken} = useAppSelector(state => state.userSlice);
	const getDetail = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const a = await dispatch(
				getPlaceInfo({
					name: route.params.value.name,
					lat: route.params.value.lat,
					lng: route.params.value.lng,
					region:
						region[route.params.value.regionIndex] ??
						route.params.value.region + (route.params.value.metropolitan ? ' 전체' : ''),
				}),
			).unwrap();
			//const a = await dispatch(googleKeywordApi(route.params.value)).unwrap();
			const data = a.data;
			if (a.status == 200) {
				setCourseDetail({
					status: 'firebase',
					name: data.name,
					openInfo: [data.operationTime],
					review: data.review.map((item, value) => ({
						name: item.reviewerName,
						content: item.reviewContent,
						rating: null,
						reviewUserToken: item.reviewUserToken,
						reviewPhotoList: item.reviewPhotoList,
						reviewId: item.reviewId,
						reviewerProfileImage: item.reviewerProfileImage,
					})),
					rating: null,
					address: null,
					expense: data.expense,
					information: data.information,
					infoTitle: data.infoTitle,
					infoContent: data.infoContent,
					photo: data.photo,
				});
			} else {
				setCourseDetail({
					status: 'google',
					name: data.name,
					openInfo: data.opening_hours?.weekday_text ?? '',
					review: data.reviews.map((item, value) => ({
						name: item?.author_name,
						content: item?.text,
						rating: item?.rating,
						reviewUserToken: null,
						reviewPhotoList: null,
						reviewId: null,
						reviewerProfileImage: null,
					})),
					expense: null,
					rating: data?.rating,
					address: data?.formatted_address,
					information: data?.formatted_phone_number,
					infoTitle: null,
					infoContent: data?.editorial_summary?.overview ?? null,
					photo: data?.photos.map((item, idx) => item.photo_reference),
				});
			}
			//setCourseDetail(a);
		} catch (err) {
			console.log('이유', err);
			// dispatch(
			// 	modalSliceActions.setOpenModal({
			// 		modalTitle: '여행 정보가 없습니다',
			// 	}),
			// );
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const checkDelete = (e: any) => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '삭제',
				modalSubTitle: '리뷰를 삭제하시겠습니까?',
				modalFunction: () => deleteReview(e),
				modalLeft: true,
			}),
		);
	};
	const {firebaseImageRemove} = useFirebaseStorage();
	const deleteReview = async (e: any) => {
		try {
			let data = {
				region: route.params.value.region + (route.params.value.metropolitan ? ' 전체' : ''),
				name: route.params.value.name,
				reviewContent: e.content,
				reviewUserToken: userIdToken,
				reviewPhotoList: e.reviewPhotoList,
				reviewId: e.reviewId,
			};
			e.reviewPhotoList.length != 0 &&
				(await firebaseImageRemove({pictureList: e.reviewPhotoList, id: e.reviewId, category: 'review'}));
			await dispatch(deletePlaceReview(data));
		} catch {
			dispatch(modalSliceActions.setOpenModal({modalSubTitle: '잠시후 다시 시도해주세요'}));
		} finally {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '삭제완료',
					modalSubTitle: '리뷰가 삭제되었습니다.',
					modalFunction: getDetail,
					modalBottomFunctionUse: true,
					modalBottomFinction: getDetail,
				}),
			);
		}
	};
	useFocusEffect(
		useCallback(() => {
			getDetail();
		}, []),
	);
	const toDayNoShow = async () => {
		await AsyncStorage.setItem('sobaecksan', moment().format('DD').toString());
	};
	const checkSobaecksan = async () => {
		const checkFlag = await AsyncStorage.getItem('sobaecksan');
		checkFlag != moment().format('DD').toString() &&
			route.params.value.name == '소백산국립공원(경북)' &&
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '소백산',
					modalSubTitle: '소백산은 탐방 코스를 추천받을수도있어요!',
					modalFunction: goHiking,
					modalTopText: '추천받기',
					modalBottomText: '오늘보지않기',
					modalBottomFunctionUse: true,
					modalBottomFunction: toDayNoShow,
				}),
			);
	};
	useEffect(() => {
		checkSobaecksan();
	}, []);
	const tabBarRef = useRef();
	const [tabView, setTabView] = useState(0);
	const changeTab = (e: any) => {
		Math.round(e.nativeEvent.contentOffset.x / devicesWidth) != tabView &&
			setTabView(Math.round(e.nativeEvent.contentOffset.x / devicesWidth));
	};
	const tabList = [
		{title: '상세 정보', function: () => tabBarRef.current.scrollTo({x: 0, y: 0, animated: true})},
		{title: '리뷰', function: () => tabBarRef.current.scrollToEnd({animated: true})},
	];
	const detailList = [
		{
			title: courseDetail?.address,
			logo: <SvgLocation width={widthPercentage(12)} height={widthPercentage(12)} color={colors.Gray2} />,
		},
		{
			title: courseDetail?.information,
			logo: <SvgCall width={widthPercentage(12)} height={widthPercentage(12)} color={colors.Gray2} />,
		},
		{
			title: courseDetail?.expense,
			logo: <SvgInfos width={widthPercentage(12)} height={widthPercentage(12)} color={colors.Gray2} />,
		},
	];
	const handleCopyClipBoard = (e: string) => {
		try {
			Clipboard.setString(e);
			Toast.show({type: 'success', text1: '복사가 완료되었습니다.', position: 'bottom'});
		} catch (err) {
			console.log('qwe', err);
		}
	};
	const [goState, setGoState] = useState(false);
	const [reviewState, setReviewState] = useState(false);
	const checkGoState = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		if (tabView == 0) {
			e.nativeEvent.contentOffset.y > 30 ? setGoState(true) : setGoState(false);
		} else {
			e.nativeEvent.contentOffset.y > 30 ? setReviewState(true) : setReviewState(false);
		}
	};
	const goIncludeRecommend = () => {
		let region: string[] = [];
		if (route.params.value.region.includes(' ')) {
			region = route.params.value.region.split(' ');
		} else {
			region = [route.params.value.region, '전체'];
		}
		const cityIndex = cityViewList.find(city => city.title == region[0])?.id;
		let cityDistance = cityViewList[cityIndex ?? 0].sub.findIndex(item => item.subTitle == region[1]);
		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		let data = {
			cityDistance: [cityDistance],
			cityIndex: cityIndex,
			region: [region[1]],
			essential: {
				day: 1,
				name: route.params.value.name,
				lat: route.params.value.lat,
				lng: route.params.value.lng,
				category: 5,
				takenTime: 120,
				id: shortId.generate(),
				photo: route.params.value.photo,
				cityDistance: [cityDistance],
				cityIndex: cityIndex,
				region: region[0] + ' ' + region[1],
			},
			season: season,
		};
		dispatch(travelSliceActions.setInclueRecommend(data));
		navigation.popToTop();
		navigation.navigate('EnrollTravelTitle');
	};
	const goReviewEnroll = () => {
		navigation.navigate('CourseReview', {
			value: {
				region: route.params.value.region + (route.params.value.metropolitan ? ' 전체' : ''),
				name: route.params.value.name,
			},
		});
	};
	const goHiking = () => {
		dispatch(hikingRecommendSliceActions.reset());
		navigation.navigate('HikingSelectPlay');
	};
	const [moreStatus, setMoreStatus] = useState(true);
	if (courseDetail?.name)
		return (
			<>
				<DetailContainer>
					{courseDetail.photo && (
						<PostImageSwiper
							dot={<Dot />}
							activeDot={<ActiveDot />}
							paginationStyle={{
								marginBottom: 10,
							}}
							loop={false}>
							{courseDetail.photo.map((uri, index) => (
								<Pressable
									onPress={() => {
										setImageIndex(index);
										setVisible(true);
									}}
									key={index}>
									<Image
										source={{
											uri:
												courseDetail.status == 'google'
													? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${uri}&key=${GOOGLE_API_KEY}`
													: uri,
										}}
										style={{width: widthPercentage(374), height: heightPercentage(240)}}
										alt='Place Image'
									/>
								</Pressable>
							))}
						</PostImageSwiper>
					)}
					<RecommendBorderContainer
						height={heightPercentage(480)}
						paddingBottom={route.params.value.mainFlag}>
						<ScrollView showsVerticalScrollIndicator={false}>
							{route.params.value.name == '소백산국립공원(경북)' && (
								<PrimaryButton
									marginBottom={heightPercentage(10)}
									width={widthPercentage(200)}
									height={heightPercentage(37)}
									label='탐방 코스 추천받기'
									onPress={goHiking}
									backgroundColor={colors.Primary}
									textColor={colors.Gray5}></PrimaryButton>
							)}
							<HStack justifyContent='space-between'>
								<PretendardSemiBoldText size={22} lineHeight={22} color={colors.Gray5}>
									{courseDetail.name}
								</PretendardSemiBoldText>
								{courseDetail.rating && (
									<HStack>
										<PretendardSemiBoldText size={18} lineHeight={27} color={colors.PointGreen1}>
											{courseDetail.rating}
										</PretendardSemiBoldText>
										<SvgStart
											color={colors.selectButton}
											width={widthPercentage(19)}
											height={heightPercentage(18)}
										/>
									</HStack>
								)}
							</HStack>
							<Divider width={widthPercentage(327)} height={1} color={colors.Gray2} />
							{courseDetail?.infoTitle && (
								<>
									<PretendardVariableText size={14} lineHeight={21} color={colors.Gray4}>
										{courseDetail?.infoTitle}
									</PretendardVariableText>
									<Divider width={widthPercentage(327)} height={1} color={colors.Gray2} />
								</>
							)}
							{courseDetail?.infoContent && (
								<>
									<MoreTouchable
										onPress={() => {
											setMoreStatus(!moreStatus);
										}}>
										<PretendardVariableText
											width={widthPercentage(327)}
											size={14}
											lineHeight={21}
											color={colors.Gray4}
											numberOfLines={moreStatus ? 2 : undefined}>
											{courseDetail?.infoContent}
										</PretendardVariableText>
									</MoreTouchable>
									<Divider width={widthPercentage(327)} height={1} color={colors.Gray2} />
								</>
							)}
							{detailList.map(
								(detail, detailIndex) =>
									detail.title != null && (
										<InfoContainer
											key={detailIndex}
											disabled={detailIndex != 1}
											onPress={() => {
												handleCopyClipBoard(detail.title ?? '');
											}}>
											<HStack>
												<LogoContainer>{detail.logo}</LogoContainer>
												<PretendardVariableText size={14} lineHeight={21} color={colors.Gray5}>
													{detail.title}
												</PretendardVariableText>
											</HStack>
										</InfoContainer>
									),
							)}
							{courseDetail?.openInfo && (
								<>
									<Divider width={widthPercentage(327)} height={1} color={colors.Gray2} />
									<InfoContainer disabled={true}>
										<HStack>
											<LogoContainer>
												<SvgCalendar
													width={widthPercentage(12)}
													height={widthPercentage(12)}
													color={colors.Gray2}
												/>
											</LogoContainer>
											<OpenVStack>
												{courseDetail?.openInfo.map((item, itemIndex) => (
													<PretendardVariableText
														size={14}
														lineHeight={21}
														color={colors.Gray5}
														key={itemIndex}>
														{item}
													</PretendardVariableText>
												))}
											</OpenVStack>
										</HStack>
									</InfoContainer>
								</>
							)}
							<Divider width={widthPercentage(327)} height={1} color={colors.Gray2} />
							<HStack width={widthPercentage(327)} justifyContent='space-between'>
								<HStack gap={widthPercentage(10)}>
									<PretendardSemiBoldText size={18} lineHeight={21.48} color={colors.Gray5}>
										리뷰
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={18} lineHeight={21.48} color={colors.Gray2}>
										{courseDetail.review.length}
									</PretendardSemiBoldText>
								</HStack>
								<HStack justifyContent='space-between'>
									{courseDetail.status == 'firebase' && (
										<ReviewButton onPress={goReviewEnroll}>
											<SVGReviewPencil />
											<PretendardVariableText
												size={13}
												lineHeight={20.8}
												color={colors.PointYellow}>
												리뷰 쓰기
											</PretendardVariableText>
										</ReviewButton>
									)}
								</HStack>
							</HStack>
							{courseDetail.review.length == 0 && (
								<ReviewNonContainer onPress={goReviewEnroll}>
									<PretendardVariableText size={13} lineHeight={20.8} color={colors.PointYellow}>
										첫 번째 리뷰를 작성해 보세요!
									</PretendardVariableText>
								</ReviewNonContainer>
							)}
							{courseDetail.review.map((item, idx) => (
								<ReviewContainer key={idx}>
									<HStack justifyContent='space-between'>
										<HStack>
											<ReviewerProfileImage
												source={{uri: item.reviewerProfileImage}}></ReviewerProfileImage>

											<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Gray5}>
												{item.name}
											</PretendardSemiBoldText>
										</HStack>
										{item.rating && (
											<PretendardSemiBoldText
												size={14}
												lineHeight={21}
												color={colors.PointGreen1}>
												{item.rating}
											</PretendardSemiBoldText>
										)}
										{item.reviewUserToken == userIdToken && (
											<Pressable
												onPress={() => {
													deleteReview(item);
												}}>
												<PretendardSemiBoldText
													size={14}
													lineHeight={21}
													color={colors.PointGreen1}>
													삭제
												</PretendardSemiBoldText>
											</Pressable>
										)}
									</HStack>
									{item.reviewPhotoList?.length != null && item.reviewPhotoList?.length != 0 && (
										<ReviewImageScroll horizontal={true} showsHorizontalScrollIndicator={false}>
											{item.reviewPhotoList?.map((value, idx) => (
												<ReviewImage
													source={{uri: value}}
													key={idx}
													width={
														item.reviewPhotoList?.length == 1
															? 327
															: item.reviewPhotoList?.length == 2
															? 159.5
															: 141
													}></ReviewImage>
											))}
										</ReviewImageScroll>
									)}
									<PretendardVariableText size={14} lineHeight={21} color={colors.Gray5}>
										{item.content}
									</PretendardVariableText>
									{idx != courseDetail.review.length - 1 && (
										<Divider width={widthPercentage(327)} height={1} color={colors.Gray2} />
									)}
								</ReviewContainer>
							))}
						</ScrollView>
						{route.params.value.mainFlag && (
							<ButtonContainer>
								<CustomButton
									label={'이 지역의 여행 일정 추천 받기'}
									onPress={goIncludeRecommend}></CustomButton>
							</ButtonContainer>
						)}
					</RecommendBorderContainer>
					{courseDetail?.photo && (
						<ImageView
							images={courseDetail?.photo.map((value, index) => ({
								uri:
									courseDetail.status == 'google'
										? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${value}&key=${GOOGLE_API_KEY}`
										: value,
							}))}
							onImageIndexChange={item => console.log(item)}
							imageIndex={imageIndex}
							visible={visible}
							onRequestClose={() => setVisible(false)}
							FooterComponent={index => {
								return (
									<ImageViewFooterComponent>
										<ImageText>
											{index.imageIndex + 1}/{courseDetail.photo.length}
										</ImageText>
									</ImageViewFooterComponent>
								);
							}}
						/>
					)}
				</DetailContainer>
			</>
		);
	return <NullContainer>{!isLoading && <MainText>정보가 없습니다!</MainText>}</NullContainer>;
}

const MoreTouchable = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
`;
export const ReviewImage = styled.Image<{width: number}>`
	width: ${props => props.width}px;
	height: ${heightPercentage(120)}px;
	resize-mode: stretch;
	margin-right: ${widthPercentage(4)}px;
	border-radius: 6px;
`;
export const ReviewImageScroll = styled.ScrollView`
	height: ${heightPercentage(120)}px;
`;
export const ReviewContainer = styled.View`
	width: ${widthPercentage(327)}px;
	gap: ${heightPercentage(5)}px;
	margin-top: ${heightPercentage(5)}px;
`;
export const ReviewerProfileImage = styled.Image`
	width: ${widthPercentage(28)}px;
	height: ${widthPercentage(28)}px;
	background-color: ${colors.Primary};
	border-radius: 4px;
`;
export const ReviewButton = styled.Pressable`
	flex-direction: row;
	gap: ${widthPercentage(5)}px;
	align-items: center;
	justify-content: center;
`;
export const InfoContainer = styled.Pressable`
	width: 100%;
	margin-bottom: ${heightPercentage(15)}px;
`;
const NullContainer = styled(Center)`
	flex: 1;
`;

const DetailContainer = styled.View`
	background-color: ${colors.main};
	flex: 1;
`;
export const ImageViewFooterComponent = styled.View`
	width: 100%;
	height: 50px;
	align-items: center;
`;
export const LogoContainer = styled.View`
	width: ${widthPercentage(30)}px;
`;

const OpenVStack = styled.View`
	width: 80%;
`;
const ReviewElementText = styled.Text`
	font-size: 16px;
	font-weight: 600;
	color: black;
`;
export const ImageText = styled(ReviewElementText)`
	color: white;
`;
const ReviewNonContainer = styled.Pressable`
	width: ${widthPercentage(327)}px;
	align-items: center;
	justify-content: center;
	height: ${heightPercentage(100)}px;
`;
