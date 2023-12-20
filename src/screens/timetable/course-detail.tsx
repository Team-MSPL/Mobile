import {useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {Image, Pressable} from 'react-native';
import {getPlaceInfo, courseInfoType} from '../../redux/travel-info/travel.slice';
import {GOOGLE_API_KEY} from '@env';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import ImageView from 'react-native-image-viewing';
import styled from 'styled-components/native';
import {Center, HStack, MainText, VStack, devicesWidth} from '../../utill/layout/layout';
import {colors} from '../../utill/colors';
import {SvgCall, SvgInfos, SvgLocation, SvgStart} from '../../utill/svg/svg';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
export default function CourseDetail({navigation, route}: any) {
	const [courseDetail, setCourseDetail] = useState<courseInfoType>();
	const dispatch = useAppDispatch();
	const [visible, setVisible] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const {region} = useAppSelector(state => state.travelSlice);
	const getDetail = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const a = await dispatch(
				getPlaceInfo({
					name: route.params.value.name,
					lat: route.params.value.lat,
					lng: route.params.value.lng,
					region: route.params.value.region ?? region[route.params.value.regionIndex],
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
					})),
					expense: null,
					rating: data?.rating,
					address: data?.formatted_address,
					information: data?.formatted_phone_number,
					infoTitle: null,
					infoContent: null,
					photo: data.photos.map((item, idx) => item.photo_reference),
				});
			}
			//setCourseDetail(a);
		} catch (err) {
			console.log('이유', err);
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '여행 정보가 없습니다',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useEffect(() => {
		getDetail();
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
		{title: courseDetail?.infoTitle, logo: <SvgInfos color={colors.regionNormal} />},
		{title: courseDetail?.infoContent, logo: <SvgInfos color={colors.regionNormal} />},
		{title: courseDetail?.address, logo: <SvgLocation color={colors.regionNormal} />},
		{title: courseDetail?.information, logo: <SvgCall color={colors.regionNormal} />},
		{title: courseDetail?.expense, logo: <SvgInfos color={colors.regionNormal} />},
	];
	const handleCopyClipBoard = (e: string) => {
		try {
			Clipboard.setString(e);
			Toast.show({type: 'success', text1: '복사가 완료되었습니다.', position: 'bottom'});
		} catch (err) {
			console.log('qwe', err);
		}
	};
	if (courseDetail?.name)
		return (
			<DetailContainer>
				{courseDetail.photo && (
					<ImageScroll horizontal={true}>
						{courseDetail.photo.map((value, index) => (
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
												? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${value}&key=${GOOGLE_API_KEY}`
												: value,
									}}
									style={{width: 200, height: 200}}
									alt='Place Image'
								/>
							</Pressable>
						))}
					</ImageScroll>
				)}
				<TitleInfoContainer>
					<DetailInfoContainer>
						<TitleText>{courseDetail.name}</TitleText>
						{courseDetail.rating && (
							<RatingContainer>
								<RatingHStack>
									<SvgStart color={colors.selectButton} width={20} height={20} />
									<RatingText>{courseDetail.rating}</RatingText>
								</RatingHStack>
								<RatinInfoText>* 구글 검색 기준</RatinInfoText>
							</RatingContainer>
						)}
					</DetailInfoContainer>
				</TitleInfoContainer>
				<HStack>
					{tabList.map((list, listIndex) => (
						<TabTouchableOpacity
							key={listIndex}
							color={listIndex == tabView ? colors.selectButton : colors.regionNormal}
							onPress={list.function}>
							<TabText color={listIndex == tabView ? colors.selectButton : 'black'}>{list.title}</TabText>
						</TabTouchableOpacity>
					))}
				</HStack>
				<TabScrollView
					horizontal={true}
					nestedScrollEnabled={true}
					pagingEnabled
					snapToInterval={devicesWidth}
					scrollEventThrottle={180}
					decelerationRate={'fast'}
					ref={tabBarRef}
					disableIntervalMomentum={true}
					onScroll={e => {
						changeTab(e);
					}}
					showsHorizontalScrollIndicator={false}>
					<HStack>
						<ReviewContainer>
							{detailList.map(
								(detail, detailIndex) =>
									detail.title != null && (
										<DetailElementContainer
											key={detailIndex}
											disabled={detailIndex != 3}
											onPress={() => {
												handleCopyClipBoard(detail.title ?? '');
											}}>
											<HStack>
												<LogoContainer>{detail.logo}</LogoContainer>
												<DetailText>{detail.title}</DetailText>
											</HStack>
										</DetailElementContainer>
									),
							)}
							{courseDetail?.openInfo && (
								<OpenContainer>
									<HStack>
										<LogoContainer>
											<SvgInfos color={colors.regionNormal} />
										</LogoContainer>
										<OpenVStack>
											{courseDetail?.openInfo.map((item, itemIndex) => (
												<DetailText key={itemIndex}>{item}</DetailText>
											))}
										</OpenVStack>
									</HStack>
								</OpenContainer>
							)}
						</ReviewContainer>
						<ReviewContainer>
							{courseDetail?.review.length != 0 ? (
								courseDetail.review.map((item, idx) => (
									<OpenContainer key={idx}>
										<OpenVStack>
											<ReviewTitleText>{item.name}</ReviewTitleText>
											<ReviewElementText>{item.content}</ReviewElementText>
										</OpenVStack>
										{item.rating && (
											<ReviewRating>
												<SvgStart color={colors.selectButton} width={18} height={18} />
												<ReviewText>{item.rating}</ReviewText>
											</ReviewRating>
										)}
									</OpenContainer>
								))
							) : (
								<ReviewCenter>
									<ReviewElementText>리뷰가 없습니다!</ReviewElementText>
								</ReviewCenter>
							)}
						</ReviewContainer>
					</HStack>

					{/* )} */}
				</TabScrollView>
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
		);
	return <NullContainer>{!isLoading && <MainText>정보가 없습니다!</MainText>}</NullContainer>;
}
const NullContainer = styled(Center)`
	flex: 1;
`;
const TabScrollView = styled.ScrollView`
	height: 50%;
`;
const TitleInfoContainer = styled.View`
	background-color: ${colors.main};
	width: 100%;
	padding: 2%;
`;

const DetailContainer = styled.View`
	background-color: ${colors.main};
	flex: 1;
`;
const DetailInfoContainer = styled(HStack)`
	justify-content: space-between;
	width: 100%;
`;
export const ImageViewFooterComponent = styled.View`
	width: 100%;
	height: 50px;
	align-items: center;
`;
const ImageScroll = styled.ScrollView`
	height: 35%;
`;
const RatingContainer = styled(VStack)`
	padding: 1%;
	width: 20%;
	border-radius: 20px;
	border-width: 1px;
	border-color: ${colors.selectButton};
`;
const RatingText = styled.Text`
	font-size: 15px;
	font-weight: bold;
	color: ${colors.selectButton};
	margin: 0% 0% 0% 4%;
`;
const TitleText = styled.Text`
	font-size: 25px;
	font-weight: 900;
	color: black;
	width: 80%;
`;
const RatinInfoText = styled(RatingText)`
	font-size: 8px;
`;
const RatingHStack = styled(HStack)`
	justify-content: center;
`;
const TabTouchableOpacity = styled.TouchableOpacity<{color: string}>`
	width: 50%;
	align-items: center;
	justify-content: center;
	border-bottom-width: 2px;
	border-color: ${props => props.color};
	padding: 5%;
`;
const TabText = styled.Text<{color: string}>`
	font-size: 17px;
	font-weight: 700;
	color: ${props => props.color};
`;
const DetailElementContainer = styled.TouchableOpacity`
	border-bottom-width: 1px;
	border-bottom-color: ${colors.regionNormal};
	padding: 5%;
`;
const DetailText = styled.Text`
	font-size: 15px;
	color: black;
	margin: 2% 0% 0% 0%;
	width: 80%;
`;
const LogoContainer = styled.View`
	width: 20%;
`;

const OpenContainer = styled(HStack)`
	align-items: center;
	border-bottom-width: 1px;
	border-bottom-color: ${colors.regionNormal};
	padding: 5%;
`;
const OpenVStack = styled.View`
	width: 80%;
`;
const ReviewRating = styled.View`
	width: 20%;
	align-items: center;
	justify-content: center;
	flex-direction: row;
`;
const ReviewText = styled.Text`
	font-size: 20px;
	font-weight: bold;
	color: ${colors.selectButton};
`;

const ReviewContainer = styled.ScrollView`
	width: ${devicesWidth}px;
	align-self: flex-start;
`;
const ReviewTitleText = styled.Text`
	font-size: 20px;
	font-weight: 900;
	color: black;
	margin: 0% 0% 1% 0%;
`;
const ReviewElementText = styled.Text`
	font-size: 16px;
	font-weight: 600;
	color: black;
`;
export const ImageText = styled(ReviewElementText)`
	color: white;
`;
const ReviewCenter = styled(Center)`
	height: 100px;
`;
