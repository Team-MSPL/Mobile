import {useAppDispatch, useAppSelector} from '../../../redux';
import {getKkdaySearch, recommendProduct, travelSliceActions} from '../../../redux/travel-info/travel.slice';
import {Divider, HStack, PretendardSemiBoldText, PretendardVariableText} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../../utill/colors';
import {SVGDanimLogo, SvgLoginLogo, SvgStart} from '../../../utill/svg/svg';
import ImageView from 'react-native-image-viewing';
import {useLayoutEffect, useState} from 'react';
import {ImageViewFooterComponent} from '../../timetable/course-detail';
import {TagElement, metropolitanCheckList} from '../../home/main';
import CustomButton from '../../../utill/component/custom-button';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {ButtonContainer} from '../select-multi';
import {Platform} from 'react-native';
import {logEvent} from '../../../../firebaseAnalytice';
import {cityViewList} from '../../../utill/component/enroll-info/city-list';
import {useTendencyHandler} from '../../../utill/hooks/useTendencyHandler';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
export default function DetailResult({navigation, route}: any) {
	const dispatch = useAppDispatch();
	const {selectStartDate, country} = useAppSelector(state => state.travelSlice);
	const {regionTendency} = useAppSelector(state => state.regionRecommendSlice);
	const goEnrollInfo = () => {
		let copy = [...regionTendency];
		let copy0 = [...regionTendency[0]];
		copy0.push(0);
		copy[0] = copy0;
		let copy2 = [...regionTendency[2]];
		copy2.pop();
		// if (copy2[6] == 1) {
		// 	//역사 누르면
		// 	copy2.push(1);
		// 	copy2.push(0);
		// 	copy2.push(1);
		// 	copy2.push(1);
		// } else {
		// 	copy2.push(0);
		// 	copy2.push(0);
		// 	copy2.push(0);
		// 	copy2.push(0);
		// }
		copy[2] = copy2;
		let copy3 = [...regionTendency[3]];
		copy3.push(0);
		copy3.push(0);
		copy3.push(0);
		copy3.push(0);
		copy3.push(0);
		if (copy3[2] == 1) {
			//자연경관 누르면
			copy3[0] = 1;
			copy3[1] = 1;
			copy3[2] = 0;
		}
		if (regionTendency[2][6] == 1) {
			copy3[5] = 1;
			copy3[6] = 1;
			copy3[7] = 1;
			copy3[9] = 1;
			copy3[10] = 1;
		}
		copy[3] = copy3;
		let selectEndDate = selectStartDate.clone().add(route.params.item.takenDay, 'days');
		let region: string[] = [];
		if (route.params.item.name.includes(' ')) {
			region = route.params.item.name.split(' ');
		} else {
			region = [route.params.item.name, '전체'];
		}
		console.log(region);
		const cityIndex =
			country == 0
				? region.at(-1) == '전체' && region[0] != '제주' && region.at(-1) == '전체' && region[0] != '서울'
					? 2
					: cityViewList[country].find(city => city.title == region[0])?.id
				: cityViewList[country].slice(1).filter(item => item.sub.find(city => city.subTitle == region[0]))[0]
						.id;
		let season = copy.pop();
		let cityDistance = cityViewList[country][cityIndex ?? 0].sub.findIndex(
			item =>
				item.subTitle ==
				region[
					country == 0
						? region.at(-1) == '전체' &&
						  region[0] != '제주' &&
						  region.at(-1) == '전체' &&
						  region[0] != '서울'
							? 0
							: 1
						: 0
				],
		);
		const data = {
			cityDistance: [cityDistance],
			cityIndex: cityIndex,
			region: [
				region[
					country == 0
						? region.at(-1) == '전체' &&
						  region[0] != '제주' &&
						  region.at(-1) == '전체' &&
						  region[0] != '서울'
							? 0
							: 1
						: 0
				],
			],
			tendency: copy,
			season: season,
			selectEndDate: selectEndDate,
			shareViewWithStartFlag: true,
			country: country,
			regionInfo: {
				name: route.params.item.name,
				photo: Array.isArray(route.params.item.photo) ? route.params.item.photo[0] : route.params.item.photo,
			},
		};
		dispatch(travelSliceActions.setRecommendRegion(data));
		navigation.navigate('EnrollTravelTitle');
	};
	// const {countryList} = useTendencyHandler();
	const countryList = [
		{ko: '한국', en: 'Korea'},
		{ko: '일본', en: 'Japan'},
		{ko: '중국', en: 'China'},
		{ko: '베트남', en: 'Vietnam'},
		{ko: '태국', en: 'Thailand'},
		{ko: '필리핀', en: 'Philippines'},
		{ko: '싱가포르', en: 'Singapore'},
	];
	const goDetail = async (e: {name: string; lat: number; lng: number}) => {
		const metropolitanStatus = metropolitanCheckList.includes(route.params.item.name);
		const data = {
			name: e.name,
			lat: e.lat,
			lng: e.lng,
			// region: route.params.item.name,
			region: country == 0 ? route.params.item.name : `해외/${countryList[country].en}/${route.params.item.name}`,
			metropolitan: metropolitanStatus,
		};
		console.log(data);
		navigation.navigate('CourseDetail', {value: data});
		await logEvent('view_place_explore', {
			location: route.params.item.name,
			place: e.name,
		});
	};
	const [visible, setVisible] = useState(false);
	const [products, setProducts] = useState([]);
	const handelDetail = async item => {
		await logEvent(`regionProduct`, {title: item?.prod_name});
		navigation.navigate('ProductDetail', {item: item});
	};
	const handleSearch = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			let copy = [...regionTendency];
			let copy0 = [...regionTendency[0]];
			copy0.push(0);
			copy[0] = copy0;
			let copy2 = [...regionTendency[2]];
			copy2.pop();
			// if (copy2[6] == 1) {
			// 	//역사 누르면
			// 	copy2.push(1);
			// 	copy2.push(0);
			// 	copy2.push(1);
			// 	copy2.push(1);
			// } else {
			// 	copy2.push(0);
			// 	copy2.push(0);
			// 	copy2.push(0);
			// 	copy2.push(0);
			// }
			copy[2] = copy2;
			let copy3 = [...regionTendency[3]];
			copy3.push(0);
			copy3.push(0);
			copy3.push(0);
			copy3.push(0);
			copy3.push(0);
			if (copy3[2] == 1) {
				//자연경관 누르면
				copy3[0] = 1;
				copy3[1] = 1;
				copy3[2] = 0;
			}
			if (regionTendency[2][6] == 1) {
				copy3[5] = 1;
				copy3[6] = 1;
				copy3[7] = 1;
				copy3[9] = 1;
				copy3[10] = 1;
			}
			copy[3] = copy3;
			const data = {
				pathList: [[route.params.item.topPopularPlaceList?.map(item => ({name: item?.name}))]],
				selectList: copy,
				country:
					route.params.item.name == '홍콩' || route.params.item.name == '마카오'
						? '홍콩과 마카오'
						: countryList[country].ko,
				cityList: [route.params.item.name],
			};
			const a = await dispatch(recommendProduct(data)).unwrap();

			console.log(a?.[0]);

			setProducts(a?.[0]);
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useLayoutEffect(() => {
		handleSearch();
	}, []);
	return (
		<>
			<MainContainer>
				<RecommendMainContainer
					onPress={() => {
						setVisible(true);
					}}>
					{route.params.item.photo != '' ? (
						<TitleImage
							source={{
								uri: Array.isArray(route.params.item.photo)
									? route.params.item.photo[0]
									: route.params.item.photo,
							}}></TitleImage>
					) : (
						<LogoCOntainer>
							<SvgLoginLogo color={'white'} width={widthPercentage(40)} />
						</LogoCOntainer>
					)}
				</RecommendMainContainer>
				<RecommendBorderContainer>
					<PretendardSemiBoldText size={24} lineHeight={28} color={colors.Gray5}>
						{route.params.item.name}
					</PretendardSemiBoldText>
					<Divider color={colors.Gray200} height={0.5}></Divider>
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

					<StepText
						mainText='인기 관광지 Top 5'
						subText='해당 지역의 인기 관광지를 확인하세요'
						mainTextSize={20}
						subTextSize={16}
						marginLeft={0}
						marginTop={0}
						marginBottom={14}
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
										<SvgLoginLogo color={'white'} width={widthPercentage(20)} />
									</LogoCOntainer>
								)}
								<GraientBackground>
									<PretendardSemiBoldText
										numberOfLines={2}
										size={20}
										lineHeight={26}
										color={colors.backgroundWhite}>
										{item.name}
									</PretendardSemiBoldText>
								</GraientBackground>
							</PopularityContainer>
						))}
					</RecommendAllContainer>
					<StepText
						mainText='여행 상품 추천'
						subText={`현재 ${route.params.item.name}에서 인기 있는 여행 상품이에요`}
						mainTextSize={20}
						subTextSize={16}
						marginLeft={0}
						marginTop={0}
						marginBottom={14}
					/>
					<RecommendAllContainer horizontal={true} showsHorizontalScrollIndicator={false}>
						{products?.map((item, idx) => (
							<ProductBox
								key={idx}
								onPress={() => {
									handelDetail(item);
								}}>
								{item?.prod_img_url != '' ? (
									<ProductImg source={{uri: item?.prod_img_url}}></ProductImg>
								) : (
									<LogoCOntainer>
										<SvgLoginLogo color={'white'} width={widthPercentage(20)} />
									</LogoCOntainer>
								)}
								<ProductinfoBox>
									<HStack justifyContent='space-between'>
										{!isNaN(item?.finalScore) && item?.finalScore != 0 ? (
											<HStack gap={3}>
												<PretendardSemiBoldText size={14} lineHeight={17} color={colors.Gray4}>
													유사도
												</PretendardSemiBoldText>
												<PretendardSemiBoldText
													size={18}
													lineHeight={22}
													color={colors.PointYellow}>
													{item?.finalScore * 100}%
												</PretendardSemiBoldText>
											</HStack>
										) : (
											<HStack gap={3}>
												<SVGDanimLogo width={15} />
												<PretendardSemiBoldText size={14} lineHeight={17} color={colors.Gray4}>
													다님
												</PretendardSemiBoldText>
											</HStack>
										)}

										<HStack>
											<SvgStart width={11} color={'#FFDE4C'} />
											<PretendardSemiBoldText size={14} lineHeight={17} color={colors.Gray4}>
												{item?.avg_rating_star}
											</PretendardSemiBoldText>
										</HStack>
									</HStack>
									<PretendardSemiBoldText
										size={24}
										lineHeight={29}
										numberOfLines={2}
										color={colors.Black}
										deco={'margin-bottom:10px;'}>
										{item?.prod_name}
									</PretendardSemiBoldText>
									{item?.b2c_price - item?.b2b_price > 0 && (
										<>
											<PretendardSemiBoldText
												size={16}
												lineHeight={20}
												color={colors.PointGreen1}
												deco={'text-align:right'}>
												{(item?.b2c_price - item?.b2b_price).toLocaleString('ko-KR')}원 할인
											</PretendardSemiBoldText>
											<PretendardSemiBoldText
												size={20}
												lineHeight={24}
												color={colors.Gray2}
												deco={'text-align:right;text-decoration:line-through;'}>
												{item?.b2c_price.toLocaleString('ko-KR')}원~
											</PretendardSemiBoldText>
										</>
									)}
									<HStack deco='align-self:flex-end' gap={4}>
										<PretendardSemiBoldText size={18} lineHeight={22} color={colors.PointYellow}>
											최저가
										</PretendardSemiBoldText>
										<PretendardSemiBoldText
											size={24}
											lineHeight={29}
											numberOfLines={2}
											color={colors.Black}>
											{item?.b2b_price.toLocaleString('ko-KR')}원~
										</PretendardSemiBoldText>
									</HStack>
								</ProductinfoBox>
							</ProductBox>
						))}
					</RecommendAllContainer>
				</RecommendBorderContainer>

				<MarginBottom></MarginBottom>
			</MainContainer>
			<ButtonContainer>
				<CustomButton label='이 지역의 여행코스 추천받기' onPress={goEnrollInfo}></CustomButton>
			</ButtonContainer>
			<ImageView
				images={[{uri: route.params.item.photo}]}
				onImageIndexChange={item => console.log(item)}
				imageIndex={0}
				visible={visible}
				onRequestClose={() => setVisible(false)}
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
		</>
	);
}
const ProductBox = styled.TouchableOpacity`
	width: ${widthPercentage(257)}px;
	height: ${heightPercentage(327)}px;
	border-radius: 8px;
	margin-right: 25px;
	border-color: ${colors.Gray1};
	border-width: 1px;
`;
const ProductImg = styled.Image`
	width: ${widthPercentage(257)}px;
	height: ${heightPercentage(125)}px;
	border-top-right-radius: 8px;
	border-top-left-radius: 8px;
`;
const ProductinfoBox = styled.View`
	width: 100%;
	padding: ${widthPercentage(10)}px;
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
const MarginBottom = styled.View`
	height: ${heightPercentage(100)}px;
`;
export const RecommendBorderContainer = styled.View<{height?: number; top?: number; paddingBottom?: boolean}>`
	width: 100%;
	height: ${props => props.height + 'px' ?? null};
	border-radius: 30px 30px 0px 0px;
	background-color: ${colors.backgroundWhite};
	padding: ${heightPercentage(38)}px ${widthPercentage(24)}px
		${props => (props.paddingBottom ? heightPercentage(100) : 0)}px ${widthPercentage(24)}px;
	margin-top: -30px;
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
	width: ${widthPercentage(Platform.isPad ? 101 : 152)}px;
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
	width: ${widthPercentage(Platform.isPad ? 101 : 152)}px;
	height: ${heightPercentage(196)}px;
`;
const GraientBackground = styled.View`
	position: absolute;
	bottom: 0px;
	width: 100%;
	height: ${widthPercentage(80)}px;
	background-color: rgba(0, 0, 0, 0.3);
	justify-content: flex-end;
	border-bottom-right-radius: 12px;
	border-bottom-left-radius: 12px;
	padding: ${widthPercentage(12)}px;
`;
