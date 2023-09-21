import {useEffect, useState} from 'react';
import {Text, Box, ScrollView} from 'native-base';
import {useAppDispatch, useAppSelector} from '../../redux';
import {TouchableOpacity, Image, Alert, Pressable, View} from 'react-native';
import {googleKeywordApi, CourseDetailType} from '../../redux/travel-info/travel.slice';
import {GOOGLE_API_KEY} from '@env';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import ImageView from 'react-native-image-viewing';
import styled from 'styled-components/native';
import {HStack, MainText, VStack} from '../../utill/layout/layout';
import {colors} from '../../utill/colors';
import {SvgApple, SvgCall, SvgLocation, SvgStart} from '../../utill/svg/svg';
export default function CourseDetail({navigation, route}: any) {
	const [courseDetail, setCourseDetail] = useState<CourseDetailType>();
	const dispatch = useAppDispatch();
	const [visible, setVisible] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);
	const getDetail = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const a = await dispatch(googleKeywordApi(route.params.value)).unwrap();
			setCourseDetail(a);
			console.log(a);
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
	useEffect(() => {
		getDetail();
	}, []);
	const [tabView, setTabView] = useState(0);

	const tabList = [
		{title: '상세 정보', function: () => setTabView(0)},
		{title: '리뷰', function: () => setTabView(1)},
	];
	const detailList = [
		{title: courseDetail?.formatted_address, logo: <SvgLocation color={colors.regionNormal} />},
		{title: courseDetail?.formatted_phone_number, logo: <SvgCall color={colors.regionNormal} />},
	];
	if (courseDetail?.name)
		return (
			<DetailContainer>
				<ImageScroll horizontal={true}>
					{courseDetail.photos &&
						courseDetail.photos.map((value, index) => (
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
				<TitleInfoContainer>
					<DetailInfoContainer>
						<VStack>
							<TitleText>{courseDetail.name ?? '정보가 없습니다'}</TitleText>
						</VStack>
						<VStack>
							<RatingContainer>
								<RatingHStack>
									<SvgStart color={colors.selectButton} width={20} height={20} />
									<RatingText>{courseDetail.rating ?? 'x'}</RatingText>
								</RatingHStack>
							</RatingContainer>
							<RatinInfoText>* 구글 검색 기준</RatinInfoText>
						</VStack>
					</DetailInfoContainer>
				</TitleInfoContainer>
				<HStack>
					{tabList.map((list, listIndex) => (
						<TabTouchableOpacity
							color={listIndex == tabView ? colors.selectButton : colors.regionNormal}
							onPress={list.function}>
							<TabText color={listIndex == tabView ? colors.selectButton : 'black'}>{list.title}</TabText>
						</TabTouchableOpacity>
					))}
				</HStack>

				{tabView == 0 ? (
					<>
						{detailList.map((detail, detailIndex) => {
							detail.title != null && (
								<DetailElementContainer>
									<LogoContainer>{detail.logo}</LogoContainer>
									<DetailText>{detail.title}</DetailText>
								</DetailElementContainer>
							);
						})}
						<DetailElementContainer>
							<LogoContainer>
								<SvgCall color={colors.regionNormal} />
							</LogoContainer>
							{courseDetail?.opening_hours.weekday_text.map(item => (
								<DetailText>{item}</DetailText>
							))}
						</DetailElementContainer>
					</>
				) : (
					<Text>ad</Text>
				)}
				{detailList.map((item, po) => (
					<Text>{item.title}</Text>
				))}
				{courseDetail.reviews && courseDetail.reviews.map((item, idx) => <Text key={idx}>{item.text}</Text>)}

				<ImageView
					images={courseDetail.photos.map((value, index) => ({
						uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${value.photo_reference}&key=${GOOGLE_API_KEY}`,
					}))}
					onImageIndexChange={item => console.log(item)}
					imageIndex={imageIndex}
					visible={visible}
					onRequestClose={() => setVisible(false)}
					FooterComponent={index => {
						return (
							<ImageViewFooterComponent>
								<Text color='white'>
									{index.imageIndex + 1}/{courseDetail.photos.length}
								</Text>
							</ImageViewFooterComponent>
						);
					}}
				/>
			</DetailContainer>
		);
	return (
		<Box>
			<Text>qwe</Text>
		</Box>
	);
}

const TabScrollView = styled.ScrollView``;
const TitleInfoContainer = styled.View`
	background-color: white;
	padding: 2%;
`;

const DetailContainer = styled.View`
	background-color: white;
`;
const DetailInfoContainer = styled(HStack)`
	justify-content: space-between;
	padding: 1%;
`;
const ImageViewFooterComponent = styled.View`
	width: 100%;
	height: 50;
	align-items: center;
`;
const ImageScroll = styled.ScrollView`
	height: 20%;
`;
const RatingContainer = styled.View`
	padding: 5%;
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
`;
const RatinInfoText = styled(RatingText)`
	font-size: 10px;
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
