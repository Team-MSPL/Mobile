import {useAppDispatch, useAppSelector} from '../../../redux';
import {travelSliceActions} from '../../../redux/travel-info/travel.slice';
import {cityViewList} from '../select-city';
import {Divider, HStack, PretendardSemiBoldText, PretendardVariableText} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../../utill/colors';
import {SVGReviewPencil, SvgCall, SvgInfos, SvgLocation, SvgLoginLogo} from '../../../utill/svg/svg';
import ImageView from 'react-native-image-viewing';
import {useState} from 'react';
import {
	ImageViewFooterComponent,
	InfoContainer,
	LogoContainer,
	ReviewButton,
	ReviewContainer,
	ReviewImage,
	ReviewImageScroll,
	ReviewerProfileImage,
} from '../../timetable/course-detail';
import {TagElement, metropolitanCheckList} from '../../home/main';
import CustomButton from '../../../utill/component/custom-button';
import {fontPercentage, heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {Image, Pressable} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import useFirebaseStorage from '../../../utill/hooks/useFirebaseStorage';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {hikingDeleteReview} from '../../../redux/travel-info/hiking.slice';
import {ActiveDot, Dot, PostImageSwiper} from '../../../utill/component/community/community-post';
export default function HikingDetailResult({navigation, route}: any) {
	const dispatch = useAppDispatch();
	const {selectStartDate} = useAppSelector(state => state.travelSlice);
	const {regionTendency} = useAppSelector(state => state.regionRecommendSlice);
	const {userIdToken} = useAppSelector(state => state.userSlice);
	const goEnrollInfo = () => {
		let copy = [...regionTendency];
		let copy2 = [...regionTendency[2]];
		if (copy2[4] == 1) {
			copy2.push(1);
			copy2.push(0);
			copy2.push(1);
			copy2.push(1);
		} else {
			copy2.push(0);
			copy2.push(0);
			copy2.push(0);
			copy2.push(0);
		}
		copy[2] = copy2;
		let copy3 = [...regionTendency[3]];
		if (copy3[5] == 1) {
			copy3[0] = 1;
			copy3[1] = 1;
			copy3[5] = 0;
		}
		copy[3] = copy3;
		let selectEndDate = selectStartDate.clone().add(route.params.item.takenDay, 'days');
		let region: string[] = [];
		if (route.params.item.name.includes(' ')) {
			region = route.params.item.name.split(' ');
		} else {
			region = [route.params.item.name, '전체'];
		}
		const cityIndex = cityViewList.find(city => city.title == region[0])?.id;
		let season = copy.pop();
		let cityDistance = cityViewList[cityIndex ?? 0].sub.findIndex(item => item.subTitle == region[1]);
		const data = {
			cityDistance: [cityDistance],
			cityIndex: cityIndex,
			region: [region[1]],
			tendency: copy,
			season: season,
			selectEndDate: selectEndDate,
		};
		dispatch(travelSliceActions.setRecommendRegion(data));
		navigation.navigate('EnrollTravelTitle');
	};
	const goDetail = (e: {name: string; lat: number; lng: number}) => {
		const metropolitanStatus = metropolitanCheckList.includes(route.params.item.name);
		const data = {
			name: e.name,
			lat: e.lat,
			lng: e.lng,
			region: route.params.item.name,
			metropolitan: metropolitanStatus,
		};
		navigation.navigate('CourseDetail', {value: data});
	};
	const [visible, setVisible] = useState(false);
	const detailList = [
		{
			title: route.params.item.course,
			logo: <SvgLocation width={widthPercentage(24)} height={widthPercentage(24)} color={colors.Gray2} />,
		},
		{
			title: route.params.item.phoneNum,
			logo: <SvgCall width={widthPercentage(20)} height={widthPercentage(20)} color={colors.Gray2} />,
		},
		{
			title: '거리' + route.params.item?.distance + ' km',
			logo: <SvgInfos width={widthPercentage(20)} height={widthPercentage(20)} color={colors.Gray2} />,
		},
		{
			title:
				'예상 소요 시간 ' +
				(route.params.item?.takenTime >= 60 ? Math.floor(route.params.item?.takenTime / 60) + '시간' : '') +
				(route.params.item?.takenTime % 60 == 0 ? '' : (route.params.item?.takenTime % 60) + ' 분'),
			logo: <SvgInfos width={widthPercentage(20)} height={widthPercentage(20)} color={colors.Gray2} />,
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
	const goReviewEnroll = () => {
		navigation.navigate('CourseReview', {
			value: {
				region: '소백산국립공원(경북)',
				name: route.params.item.name,
			},
		});
	};
	const {firebaseImageRemove} = useFirebaseStorage();
	const deleteReview = async (e: any) => {
		try {
			let data = {
				region: '소백산국립공원(경북)',
				name: route.params.item.name,
				reviewId: e.reviewId,
			};
			e.reviewPhotoList.length != 0 &&
				(await firebaseImageRemove({pictureList: e.reviewPhotoList, id: e.reviewId, category: 'review'}));
			await dispatch(hikingDeleteReview(data));
		} catch {
			dispatch(modalSliceActions.setOpenModal({modalSubTitle: '잠시후 다시 시도해주세요'}));
		} finally {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '삭제완료',
					modalSubTitle: '리뷰가 삭제되었습니다.',
					modalFunction: () => {},
					modalBottomFunctionUse: true,
					modalBottomFinction: () => {},
				}),
			);
		}
	};
	const [imageIndex, setImageIndex] = useState(0);
	return (
		<>
			<MainContainer>
				<PostImageSwiper
					height={heightPercentage(240)}
					dot={<Dot />}
					activeDot={<ActiveDot />}
					paginationStyle={{
						marginBottom: 24,
					}}
					loop={false}>
					{route.params.item.photo.map((uri, index) => (
						<Pressable
							onPress={() => {
								setImageIndex(index);
								setVisible(true);
							}}
							key={index}>
							<Image
								source={{
									uri: uri,
								}}
								resizeMode='contain'
								style={{width: widthPercentage(374), height: heightPercentage(240)}}
								alt='Place Image'
							/>
						</Pressable>
					))}
				</PostImageSwiper>
				{/* <RecommendMainContainer
					onPress={() => {
						setVisible(true);
					}}>
					{route.params.item.photo[0] != '' ? (
						<TitleImage source={{uri: route.params.item.photo[0]}}></TitleImage>
					) : (
						<LogoCOntainer>
							<SvgLoginLogo color={'white'} width={40} />
						</LogoCOntainer>
					)}
				</RecommendMainContainer> */}
				<RecommendBorderContainer>
					<PretendardSemiBoldText size={24} lineHeight={28} color={colors.Gray5}>
						{route.params.item.name}
					</PretendardSemiBoldText>
					<Divider color={colors.Gray2} height={0.5}></Divider>
					<TagContainer>
						{route.params.item.tendency.map((tendency, index) => (
							<TagElement
								backgroundColor={colors.Gray5}
								key={index}
								opacityStatus={false}
								height={heightPercentage(26)}>
								<HStack>
									<PretendardSemiBoldText size={16} lineHeight={18} color={colors.Primary}>
										{'# '}
									</PretendardSemiBoldText>
									<PretendardVariableText size={14} lineHeight={16} color={colors.backgroundWhite}>
										{tendency}
									</PretendardVariableText>
								</HStack>
							</TagElement>
						))}
					</TagContainer>
					<Divider color={colors.Gray2} height={0.5}></Divider>
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
					<Divider color={colors.Gray2} height={0.5}></Divider>
					<PretendardVariableText size={14} lineHeight={21} color={colors.Gray4}>
						{route.params.item.infoContent}
					</PretendardVariableText>
					<Divider color={colors.Gray2} height={0.5}></Divider>
					<HStack gap={widthPercentage(10)}>
						<PretendardSemiBoldText size={18} lineHeight={21.48} color={colors.Gray5}>
							리뷰
						</PretendardSemiBoldText>
						<HStack width={widthPercentage(290)} justifyContent='space-between'>
							<PretendardSemiBoldText size={18} lineHeight={21.48} color={colors.Gray2}>
								{route.params.item.review.length}
							</PretendardSemiBoldText>

							<ReviewButton onPress={goReviewEnroll}>
								<SVGReviewPencil width={widthPercentage(12)} height={widthPercentage(12)} />
								<PretendardVariableText size={13} lineHeight={20.8} color={colors.PointYellow}>
									리뷰 쓰기
								</PretendardVariableText>
							</ReviewButton>
						</HStack>
					</HStack>
					{route.params.item.review.map((item, idx) => (
						<ReviewContainer key={idx}>
							<HStack justifyContent='space-between'>
								<HStack>
									{item?.reviewerProfileImage && (
										<ReviewerProfileImage
											source={{uri: item.reviewerProfileImage}}></ReviewerProfileImage>
									)}
									{item?.name && (
										<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Gray5}>
											{item.name}
										</PretendardSemiBoldText>
									)}
								</HStack>
								{item.reviewUserToken == userIdToken && (
									<Pressable
										onPress={() => {
											deleteReview(item);
										}}>
										<PretendardSemiBoldText size={14} lineHeight={21} color={colors.PointGreen1}>
											삭제
										</PretendardSemiBoldText>
									</Pressable>
								)}
							</HStack>
							{item.reviewPhotoList?.length != 0 && (
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
								{item.reviewContent}
							</PretendardVariableText>
							{idx != route.params.item.review.length - 1 && (
								<Divider width={widthPercentage(327)} height={1} color={colors.Gray2} />
							)}
						</ReviewContainer>
					))}
					{/* <StepText
						mainText='인기 관광지 Top 5'
						subText='해당 지역의 인기 관광지를 확인하세요'
						mainTextSize={fontPercentage(18)}
						subTextSize={fontPercentage(12)}
						marginLeft={0}
						marginTop={0}
						marginBottom={heightPercentage(14)}
					/>
					<RecommendAllContainer horizontal={true} showsHorizontalScrollIndicator={false}>
						{route.params.item.topPopularPlaceList.map((item, idx) => (
							<PopularityContainer
								key={idx}
								onPress={() => {
									goDetail(item);
								}}>
								<IndexContainer>
									<PretendardSemiBoldText size={14} lineHeight={16} color={colors.Gray5}>
										{idx + 1}
									</PretendardSemiBoldText>
								</IndexContainer>
								{item.photo != '' ? (
									<RecommendImage source={{uri: item.photo}}></RecommendImage>
								) : (
									<LogoCOntainer>
										<SvgLoginLogo color={'white'} width={20} />
									</LogoCOntainer>
								)}
								<PopularityInfoTitleTextContainer>
									<PretendardSemiBoldText size={20} lineHeight={26} color={colors.backgroundWhite}>
										{item.name}
									</PretendardSemiBoldText>
								</PopularityInfoTitleTextContainer>
							</PopularityContainer>
						))}
					</RecommendAllContainer> */}
				</RecommendBorderContainer>
			</MainContainer>
			<ImageView
				images={route.params.item.photo.map((item, idx) => ({uri: item}))}
				onImageIndexChange={item => console.log(item)}
				imageIndex={imageIndex}
				visible={visible}
				onRequestClose={() => setVisible(false)}
				FooterComponent={index => {
					return (
						<ImageViewFooterComponent>
							<PretendardSemiBoldText size={14} lineHeight={16} color={colors.backgroundWhite}>
								{index.imageIndex + 1}/{route.params.item.photo.length}
							</PretendardSemiBoldText>
						</ImageViewFooterComponent>
					);
				}}
			/>
		</>
	);
}
const PopularityInfoTitleTextContainer = styled.View`
	width: 80%;
	position: absolute;
	z-index: 1;
	align-self: flex-end;
	left: ${widthPercentage(12)}px;
	bottom: ${widthPercentage(12)}px;
`;
const IndexContainer = styled.View`
	width: ${widthPercentage(24)}px;
	height: ${widthPercentage(24)}px;
	background-color: ${colors.Primary};
	align-items: center;
	justify-content: center;
	position: absolute;
	z-index: 1;
	top: ${widthPercentage(12)}px;
	left: ${widthPercentage(12)}px;
	border-radius: 6px;
`;
const TagContainer = styled.View`
	width: 100%;
	flex-direction: row;
	flex-wrap: wrap;
`;
const MainContainer = styled.ScrollView`
	width: 100%;
	background-color: ${colors.backgroundWhite};
`;
export const RecommendBorderContainer = styled.View<{height?: number}>`
	width: 100%;
	height: ${props => props.height + 'px' ?? null};
	border-radius: 30px 30px 0px 0px;
	background-color: ${colors.backgroundWhite};
	padding: 0px 0px 0px ${widthPercentage(24)}px;
	top: -30px;
`;
const RecommendMainContainer = styled.TouchableOpacity`
	width: ${widthPercentage(375)}px;
	height: ${heightPercentage(266)}px;
`;
const RecommendAllContainer = styled.ScrollView``;
const TitleImage = styled.Image`
	width: ${widthPercentage(375)}px;
	height: ${heightPercentage(266)}px;
	resize-mode: cover;
`;
const RecommendImage = styled.Image`
	width: ${widthPercentage(152)}px;
	height: ${heightPercentage(196)}px;
	margin: 0px 10px 0px 0px;
	border-radius: 10px;
`;
const LogoCOntainer = styled.View`
	width: 50px;
	height: 50px;
	align-items: center;
	border-radius: 10px;
	justify-content: center;
	background-color: ${colors.regionNormal};
	margin: 0px 10px 0px 0px;
`;
const PopularityContainer = styled.TouchableOpacity`
	margin: 0px ${widthPercentage(12)}px 0px 0px;
	display: inline-block;
	flex-direction: row;
	width: ${widthPercentage(152)}px;
	height: ${heightPercentage(196)}px;
`;
export const GoRecommendButton = styled.TouchableOpacity<{state: boolean}>`
	width: ${props => (props.state ? '20%' : '85%')};
	align-self: ${props => (props.state ? 'flex-end' : 'center')};
	right: 20px;
	border-radius: 20px;
	border-width: 1px;
	border-color: ${colors.selectButton};
	padding: 15px;
	position: absolute;
	bottom: 20px;
	background-color: ${colors.main};
`;
export const ButtonHStack = styled(HStack)`
	justify-content: space-between;
`;
