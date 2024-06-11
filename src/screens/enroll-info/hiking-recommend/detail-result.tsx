import {useAppDispatch, useAppSelector} from '../../../redux';
import {Divider, HStack, PretendardSemiBoldText, PretendardVariableText} from '../../../utill/layout/layout';
import styled from 'styled-components/native';
import {colors} from '../../../utill/colors';
import {SVGReviewPencil, SvgCall, SvgInfos, SvgLocation} from '../../../utill/svg/svg';
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
import {TagElement} from '../../home/main';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {Image, Pressable} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import useFirebaseStorage from '../../../utill/hooks/useFirebaseStorage';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {hikingDeleteReview} from '../../../redux/travel-info/hiking.slice';
import {ActiveDot, Dot, PostImageSwiper} from '../../../utill/component/community/community-post';
export default function HikingDetailResult({navigation, route}: any) {
	const dispatch = useAppDispatch();
	const {userIdToken} = useAppSelector(state => state.userSlice);
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
