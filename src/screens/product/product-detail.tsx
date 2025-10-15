import {useRoute} from '@react-navigation/native';
import {useEffect, useLayoutEffect, useState} from 'react';
import {styled} from 'styled-components/native';
import {useAppDispatch} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {getQueryProduct} from '../../redux/travel-info/travel.slice';
import {colors} from '../../utill/colors';
import RouteButton from '../../utill/component/route-button';
import ImageView from 'react-native-image-viewing';
import {
	BackgroundGrayScrollView,
	Divider,
	HStack,
	ImageBox,
	PretendardBoldText,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
} from '../../utill/layout/layout';
import {widthPercentage} from '../../utill/layout/responsive-size';
import {SVGGlobal, SVGHeart, SVGMoney, SvgRight, SVGRightAdd, SvgShare, SvgShare1} from '../../utill/svg/svg';
import {MarginContainer} from '../timetable/preset-detail';
import RenderHtml from 'react-native-render-html';
import {Image} from 'react-native';
import AutoSizedImage from '../../utill/component/product/auto-size-image';
import {ImageViewFooterComponent} from '../timetable/course-detail';

export default function ProductDetail({navigation}: any) {
	const route = useRoute();
	const {item}: any = route.params;
	const [productInfo, setProductInfo] = useState(null);
	const dispatch = useAppDispatch();
	const handleDetail = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const data = await dispatch(getQueryProduct(item?.prod_no)).unwrap();
			setProductInfo(data);
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useLayoutEffect(() => {
		handleDetail();
	}, []);
	const [visible, setVisible] = useState({status: false, index: 0});
	const handleDetailImage = (e: number) => {
		setVisible({status: true, index: e});
	};
	return (
		<>
			<Container>
				<ImageBox
					width={widthPercentage(375)}
					height={widthPercentage(282)}
					source={{uri: productInfo?.prod?.img_list[0]}}></ImageBox>
				<PaddingContainer>
					{/* {productInfo?.pkg?.map((item, idx) => (
						<PackageBox>
							<PretendardSemiBoldText size={22} lineHeight={26} numberOfLines={2} color={colors.Black}>
								{item?.pkg_name}
							</PretendardSemiBoldText>
							{item?.description_module?.PMDL_PACKAGE_DESC?.content?.list?.map(
								(explainItem, explainIndex) => (
									<RenderHtml
										contentWidth={widthPercentage(327)}
										source={{html: explainItem?.desc}}
									/>
								),
							)}
						</PackageBox>
					))} */}
					{/* <HStack justifyContent='space-between' alignItems='center'>
					<VStack style={{flex: 1}}>
						{!isNaN(item?.product?.similarity) && (
							<PretendardBoldText size={14} lineHeight={21.6} color={colors.PointYellow}>
								유사도
								<PretendardBoldText size={15} lineHeight={19} color={colors.PointYellow}>
									{item?.product?.similarity * 100}%
								</PretendardBoldText>
							</PretendardBoldText>
						)}
					</VStack>
					<HStack deco='gap:20px;'>
						<SVGHeart width={widthPercentage(30)} height={widthPercentage(30)} />
						<SvgShare1 width={widthPercentage(26)} height={widthPercentage(26)} />
					</HStack>
				</HStack> */}
					<PretendardSemiBoldText size={24} lineHeight={29} numberOfLines={2} color={colors.Black}>
						{productInfo?.prod?.prod_name}
					</PretendardSemiBoldText>
					{productInfo?.prod?.b2c_min_price - productInfo?.prod?.b2b_min_price > 0 && (
						<>
							<PretendardSemiBoldText
								size={16}
								lineHeight={20}
								color={colors.PointGreen1}
								deco={'text-align:right'}>
								{(productInfo?.prod?.b2c_min_price - productInfo?.prod?.b2b_min_price).toLocaleString(
									'ko-KR',
								)}
								원 할인
							</PretendardSemiBoldText>
							<PretendardSemiBoldText
								size={20}
								lineHeight={24}
								color={colors.Gray2}
								deco={'text-align:right;text-decoration:line-through;'}>
								{productInfo?.prod?.b2c_min_price.toLocaleString('ko-KR')}원~
							</PretendardSemiBoldText>
						</>
					)}
					<HStack deco='align-self:flex-end' gap={4}>
						<PretendardSemiBoldText size={18} lineHeight={22} color={colors.PointYellow}>
							최저가
						</PretendardSemiBoldText>
						<PretendardSemiBoldText size={24} lineHeight={29} numberOfLines={2} color={colors.Black}>
							{productInfo?.prod?.b2b_min_price.toLocaleString('ko-KR')}원~
						</PretendardSemiBoldText>
					</HStack>
					{productInfo?.prod?.have_translate ? (
						<HStack gap={3}>
							<SVGGlobal />
							<PretendardSemiBoldText size={16} lineHeight={21} numberOfLines={2} color={colors.Black}>
								한국어 지원 {!productInfo?.prod?.have_translate ? '불가' : '가능'}
							</PretendardSemiBoldText>
						</HStack>
					) : null}
					<HStack gap={3}>
						<SVGMoney />
						<PretendardSemiBoldText size={16} lineHeight={21} numberOfLines={2} color={colors.Black}>
							{productInfo?.prod?.is_cancel_free ? '무료 취소' : '취소 불가'}
						</PretendardSemiBoldText>
					</HStack>
					<Divider color={colors.Gray200} height={2} />

					<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
						{productInfo?.prod?.description_module?.PMDL_GRAPHIC?.module_title}
					</PretendardSemiBoldText>
					{productInfo?.prod?.description_module?.PMDL_GRAPHIC?.content?.list?.map((item, imgIdx) => (
						<AutoSizedImage
							imgIdx={imgIdx}
							uri={item.media[0]?.source_content}
							handleDetailImage={handleDetailImage}></AutoSizedImage>
					))}

					{/* <PretendardVariableText size={18} lineHeight={23} color={colors.Black}>
						{productInfo?.prod?.introduction}
					</PretendardVariableText> */}
					<RenderHtml contentWidth={widthPercentage(327)} source={{html: productInfo?.prod?.introduction}} />
					<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
						{productInfo?.prod?.description_module?.PMDL_INTRODUCE_SUMMARY?.module_title}
					</PretendardSemiBoldText>
					<RenderHtml
						contentWidth={widthPercentage(327)}
						source={{html: productInfo?.prod?.description_module?.PMDL_INTRODUCE_SUMMARY?.content?.desc}}
					/>
					<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
						{productInfo?.prod?.description_module?.PMDL_EXPERIENCE_LOCATION?.module_title}
					</PretendardSemiBoldText>
					<RenderHtml
						contentWidth={widthPercentage(327)}
						source={{
							html: productInfo?.prod?.description_module?.PMDL_EXPERIENCE_LOCATION?.content?.list[0]
								?.active_time_desc?.desc,
						}}
					/>
					<RenderHtml
						contentWidth={widthPercentage(327)}
						source={{
							html: productInfo?.prod?.description_module?.PMDL_EXPERIENCE_LOCATION?.content?.list[0]
								?.arrival_desc?.desc,
						}}
					/>
					{productInfo?.prod?.description_module?.PMDL_NOTICE?.content?.properties?.cust_reminds?.list?.map(
						(noticeItem, noticeIndex) => (
							<RenderHtml
								contentWidth={widthPercentage(327)}
								source={{
									html: noticeItem,
								}}
							/>
						),
					)}
					<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
						{productInfo?.prod?.description_module?.PMDL_PURCHASE_SUMMARY?.module_title}
					</PretendardSemiBoldText>
					<RenderHtml
						contentWidth={widthPercentage(327)}
						source={{html: productInfo?.prod?.description_module?.PMDL_PURCHASE_SUMMARY?.content?.desc}}
					/>
					<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
						{productInfo?.prod?.description_module?.PMDL_EXCHANGE_LOCATION?.module_title}
					</PretendardSemiBoldText>
					<Section>
						{productInfo?.prod?.description_module?.PMDL_EXCHANGE_LOCATION?.content?.properties?.locations?.list?.map(
							(location, index) => (
								<LocationCard key={index}>
									<AirportName>
										{location.location_info.properties.airport_name?.desc ||
											location.location_info.properties.store_name?.desc}
									</AirportName>
									{location?.station_list?.list?.map((station, stationIndex) => (
										<StationInfo key={stationIndex}>
											{station.station_desc && (
												<StationDescription>{station.station_desc.desc}</StationDescription>
											)}
											<ServiceText>{station.provide_service.desc}</ServiceText>

											<InfoTable>
												<TableRow>
													<TableHeader>요일</TableHeader>
													<TableHeader>운영 시간</TableHeader>
												</TableRow>
												{station.active_time.list.map((time, timeIndex) => (
													<TableRow key={timeIndex}>
														<TableCell>{time.week_title.desc}</TableCell>
														<TableCell>
															{time.start_time
																? `${time.start_time.desc} - ${time.end_time.desc}`
																: time.close_desc?.desc || '정보 없음'}
														</TableCell>
													</TableRow>
												))}
											</InfoTable>

											{station.active_time_desc && (
												<RenderHtml
													contentWidth={widthPercentage(327)}
													source={{html: station.active_time_desc.desc}}
												/>
											)}
											{station.arrival_desc && (
												<ArrivalDescription>
													교통안내: {station.arrival_desc.desc}
												</ArrivalDescription>
											)}
										</StationInfo>
									))}
								</LocationCard>
							),
						)}
					</Section>
					<MarginContainer />
				</PaddingContainer>
			</Container>

			<ImageView
				images={[
					{
						uri: productInfo?.prod?.description_module?.PMDL_GRAPHIC?.content?.list[visible.index]?.media[0]
							?.source_content,
					},
				]}
				onImageIndexChange={item => console.log(item)}
				imageIndex={0}
				visible={visible.status}
				onRequestClose={() => setVisible({status: false, index: 0})}
				FooterComponent={index => {
					return (
						<ImageViewFooterComponent>
							<PretendardSemiBoldText size={14} lineHeight={16} color={colors.backgroundWhite}>
								{index.imageIndex + 1}/{1}
							</PretendardSemiBoldText>
						</ImageViewFooterComponent>
					);
				}}
			/>
			<RouteButton
				navigation={navigation}
				isDisabled={!(productInfo?.pkg?.length > 0)}
				type={'planner'}
				nextText={'예약하기'}
				goNext={() => {
					navigation.navigate('PackageSelect', {data: productInfo});
				}}
				nextTitle='RecommendSelectTour'></RouteButton>
		</>
	);
}
const Container = styled.ScrollView`
	background-color: ${colors.backgroundWhite};
`;
const PaddingContainer = styled.View`
	padding: ${widthPercentage(20)}px ${widthPercentage(17)}px;
	gap: ${widthPercentage(10)}px;
`;
const Section = styled.View`
	margin-bottom: 24px;
	background-color: white;
	border-radius: 8px;
	padding: 16px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	elevation: 3;
`;

const LocationCard = styled.View`
	margin-bottom: 16px;
	padding: 12px;
	border-width: 1px;
	border-color: #e0e0e0;
	border-radius: 8px;
`;

const AirportName = styled.Text`
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 10px;
`;

const StationInfo = styled.View`
	padding-left: 10px;
	border-left-width: 3px;
	border-left-color: #007bff;
	margin-bottom: 10px;
`;

const StationDescription = styled.Text`
	font-size: 16px;
	font-weight: 600;
	margin-bottom: 4px;
`;

const ServiceText = styled.Text`
	font-size: 14px;
	color: green;
	margin-bottom: 8px;
`;

const InfoTable = styled.View`
	margin-top: 8px;
	border-width: 1px;
	border-color: #ddd;
	border-radius: 4px;
`;

const TableRow = styled.View`
	flex-direction: row;
	justify-content: space-between;
	padding: 8px 10px;
	border-bottom-width: 1px;
	border-bottom-color: #ddd;
`;

const TableHeader = styled.Text`
	font-weight: bold;
	flex: 1;
`;

const TableCell = styled.Text`
	flex: 1;
`;

const ArrivalDescription = styled.Text`
	margin-top: 8px;
	font-style: italic;
	color: #555;
`;
