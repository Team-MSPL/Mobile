import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {Image, Pressable} from 'react-native';
import {googleKeywordApi, CourseDetailType} from '../../redux/travel-info/travel.slice';
import {GOOGLE_API_KEY} from '@env';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import ImageView from 'react-native-image-viewing';
import styled from 'styled-components/native';
import {Center, HStack, MainText, VStack} from '../../utill/layout/layout';
import {colors} from '../../utill/colors';
import {SvgCall, SvgInfos, SvgLocation, SvgStart} from '../../utill/svg/svg';
export default function CourseDetail({navigation, route}: any) {
	const [courseDetail, setCourseDetail] = useState<CourseDetailType>();
	const dispatch = useAppDispatch();
	const [visible, setVisible] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const getDetail = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const a = await dispatch(googleKeywordApi(route.params.value)).unwrap();
			setCourseDetail(a);
		} catch (err) {
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
	const [tabView, setTabView] = useState(0);

	const tabList = [
		{title: '상세 정보', function: () => setTabView(0)},
		{title: '리뷰', function: () => setTabView(1)},
	];
	const detailList = [
		{title: courseDetail?.formatted_address ?? null, logo: <SvgLocation color={colors.regionNormal} />},
		{title: courseDetail?.formatted_phone_number ?? null, logo: <SvgCall color={colors.regionNormal} />},
	];
	if (courseDetail?.name)
		return (
			<DetailContainer>
				{courseDetail.photos && (
					<ImageScroll horizontal={true}>
						{courseDetail.photos.map((value, index) => (
							<Pressable
								onPress={() => {
									setImageIndex(index);
									setVisible(true);
								}}
								key={index}>
								<Image
									source={{
										uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${value.photo_reference}&key=${GOOGLE_API_KEY}`,
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
						<TitleText>{courseDetail.name ?? '정보가 없습니다'}</TitleText>
						<RatingContainer>
							<RatingHStack>
								<SvgStart color={colors.selectButton} width={20} height={20} />
								<RatingText>{courseDetail.rating ?? '0'}</RatingText>
							</RatingHStack>
							<RatinInfoText>* 구글 검색 기준</RatinInfoText>
						</RatingContainer>
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
				<TabScrollView>
					{tabView == 0 ? (
						<>
							{detailList.map(
								(detail, detailIndex) =>
									detail.title != null && (
										<DetailElementContainer key={detailIndex}>
											<HStack>
												<LogoContainer>{detail.logo}</LogoContainer>
												<DetailText>{detail.title}</DetailText>
											</HStack>
										</DetailElementContainer>
									),
							)}
							{courseDetail?.opening_hours?.weekday_text && (
								<OpenContainer>
									<HStack>
										<LogoContainer>
											<SvgInfos color={colors.regionNormal} />
										</LogoContainer>
										<OpenVStack>
											{courseDetail?.opening_hours.weekday_text.map((item, itemIndex) => (
												<DetailText key={itemIndex}>{item}</DetailText>
											))}
										</OpenVStack>
									</HStack>
								</OpenContainer>
							)}
						</>
					) : (
						<ReviewContainer>
							{courseDetail?.reviews ? (
								courseDetail.reviews.map((item, idx) => (
									<OpenContainer key={idx}>
										<OpenVStack>
											<ReviewTitleText>{item.author_name}</ReviewTitleText>
											<ReviewElementText>{item.text}</ReviewElementText>
										</OpenVStack>
										<ReviewRating>
											<SvgStart color={colors.selectButton} width={18} height={18} />
											<ReviewText>{item.rating}</ReviewText>
										</ReviewRating>
									</OpenContainer>
								))
							) : (
								<ReviewCenter>
									<ReviewElementText>리뷰가 없습니다!</ReviewElementText>
								</ReviewCenter>
							)}
						</ReviewContainer>
					)}
				</TabScrollView>
				{courseDetail?.photos && (
					<ImageView
						images={courseDetail?.photos.map((value, index) => ({
							uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${value.photo_reference}&key=${GOOGLE_API_KEY}`,
						}))}
						onImageIndexChange={item => console.log(item)}
						imageIndex={imageIndex}
						visible={visible}
						onRequestClose={() => setVisible(false)}
						FooterComponent={index => {
							return (
								<ImageViewFooterComponent>
									<ImageText>
										{index.imageIndex + 1}/{courseDetail.photos.length}
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
	height: 50;
	align-items: center;
`;
const ImageScroll = styled.ScrollView`
	height: 20%;
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
const DetailElementContainer = styled.View`
	border-bottom-width: 1px;
	border-bottom-color: ${colors.regionNormal};
	padding: 5%;
`;
const DetailText = styled.Text`
	font-size: 15px;
	color: black;
	margin: 2% 0% 0% 0%;
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

const ReviewContainer = styled.View``;
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
